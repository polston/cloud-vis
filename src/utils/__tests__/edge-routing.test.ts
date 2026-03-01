import { describe, it, expect } from 'vitest';
import {
  computeEdgeRouting,
  computeHandlePositions,
  rectIntersectsSegment,
  pointOnPath,
  type NodeBounds,
  type Segment,
} from '../edge-routing';
import type { Edge } from '@xyflow/react';

// ── computeHandlePositions ──────────────────────────────────────

describe('computeHandlePositions', () => {
  it('returns empty array for zero connections', () => {
    expect(computeHandlePositions(0)).toEqual([]);
  });

  it('returns [50] for a single connection', () => {
    expect(computeHandlePositions(1)).toEqual([50]);
  });

  it('spreads from 20 to 80 for two connections', () => {
    const pos = computeHandlePositions(2);
    expect(pos).toEqual([20, 80]);
  });

  it('spreads evenly for three connections', () => {
    const pos = computeHandlePositions(3);
    expect(pos[0]).toBe(20);
    expect(pos[1]).toBe(50);
    expect(pos[2]).toBe(80);
  });

  it('handles large fan-out', () => {
    const pos = computeHandlePositions(7);
    expect(pos).toHaveLength(7);
    expect(pos[0]).toBe(20);
    expect(pos[6]).toBe(80);
    // All positions should be ascending
    for (let i = 1; i < pos.length; i++) {
      expect(pos[i]).toBeGreaterThan(pos[i - 1]);
    }
  });
});

// ── rectIntersectsSegment ───────────────────────────────────────

describe('rectIntersectsSegment', () => {
  it('detects intersection of horizontal segment through rect', () => {
    const seg: Segment = { x1: 0, y1: 50, x2: 200, y2: 50 };
    expect(rectIntersectsSegment(50, 30, 100, 40, seg)).toBe(true);
  });

  it('returns false when segment is above rect', () => {
    const seg: Segment = { x1: 0, y1: 10, x2: 200, y2: 10 };
    expect(rectIntersectsSegment(50, 30, 100, 40, seg)).toBe(false);
  });

  it('returns false when segment is to the right of rect', () => {
    const seg: Segment = { x1: 200, y1: 50, x2: 300, y2: 50 };
    expect(rectIntersectsSegment(50, 30, 100, 40, seg)).toBe(false);
  });

  it('detects vertical segment through rect', () => {
    const seg: Segment = { x1: 100, y1: 0, x2: 100, y2: 100 };
    expect(rectIntersectsSegment(50, 30, 100, 40, seg)).toBe(true);
  });
});

// ── pointOnPath ─────────────────────────────────────────────────

describe('pointOnPath', () => {
  const segs: Segment[] = [
    { x1: 0, y1: 0, x2: 0, y2: 100 },
    { x1: 0, y1: 100, x2: 100, y2: 100 },
    { x1: 100, y1: 100, x2: 100, y2: 200 },
  ];

  it('returns start point at t=0', () => {
    const pt = pointOnPath(segs, 0);
    expect(pt.x).toBe(0);
    expect(pt.y).toBe(0);
  });

  it('returns end point at t=1', () => {
    const pt = pointOnPath(segs, 1);
    expect(pt.x).toBe(100);
    expect(pt.y).toBe(200);
  });

  it('returns midpoint at t=0.5 on equal-length segments', () => {
    const pt = pointOnPath(segs, 0.5);
    // Total length = 100 + 100 + 100 = 300. At t=0.5 = 150 along path.
    // First segment: 100, second starts at 100. 150 - 100 = 50 into second segment.
    // Second segment goes from (0,100) to (100,100), so at 50% it's (50, 100).
    expect(pt.x).toBeCloseTo(50);
    expect(pt.y).toBeCloseTo(100);
  });
});

// ── computeEdgeRouting ──────────────────────────────────────────

describe('computeEdgeRouting', () => {
  function makeBounds(id: string, x: number, y: number, w = 200, h = 80): [string, NodeBounds] {
    return [id, { x, y, w, h }];
  }

  it('returns empty results for no edges', () => {
    const result = computeEdgeRouting([], new Map());
    expect(result.nodeHandles.size).toBe(0);
    expect(result.edgeAssignments.size).toBe(0);
  });

  it('assigns handles and midY for a single edge', () => {
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'b' }];
    const bounds = new Map([makeBounds('a', 0, 0), makeBounds('b', 0, 200)]);
    const result = computeEdgeRouting(edges, bounds);

    const assignment = result.edgeAssignments.get('e1');
    expect(assignment).toBeDefined();
    expect(assignment!.sourceHandle).toBe('source-0');
    expect(assignment!.targetHandle).toBe('target-0');
    expect(assignment!.midY).toBeDefined();
  });

  it('returns relativeMidY between 0 and 1', () => {
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'b' }];
    const bounds = new Map([makeBounds('a', 0, 0), makeBounds('b', 0, 200)]);
    const result = computeEdgeRouting(edges, bounds);

    const assignment = result.edgeAssignments.get('e1');
    expect(assignment!.relativeMidY).toBeGreaterThanOrEqual(0);
    expect(assignment!.relativeMidY).toBeLessThanOrEqual(1);
  });

  it('relativeMidY is approximately 0.5 for a centered edge', () => {
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'b' }];
    const bounds = new Map([makeBounds('a', 0, 0), makeBounds('b', 0, 300)]);
    const result = computeEdgeRouting(edges, bounds);

    const assignment = result.edgeAssignments.get('e1');
    expect(assignment!.relativeMidY).toBeCloseTo(0.5, 1);
  });

  it('assigns node handles for both source and target', () => {
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'b' }];
    const bounds = new Map([makeBounds('a', 0, 0), makeBounds('b', 0, 200)]);
    const result = computeEdgeRouting(edges, bounds);

    const aHandles = result.nodeHandles.get('a');
    expect(aHandles?.sourceHandles).toHaveLength(1);
    expect(aHandles?.targetHandles).toHaveLength(0);

    const bHandles = result.nodeHandles.get('b');
    expect(bHandles?.sourceHandles).toHaveLength(0);
    expect(bHandles?.targetHandles).toHaveLength(1);
  });

  it('spreads handles for multiple outgoing edges', () => {
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'a', target: 'c' },
      { id: 'e3', source: 'a', target: 'd' },
    ];
    const bounds = new Map([
      makeBounds('a', 100, 0),
      makeBounds('b', 0, 200),
      makeBounds('c', 100, 200),
      makeBounds('d', 200, 200),
    ]);
    const result = computeEdgeRouting(edges, bounds);

    const aHandles = result.nodeHandles.get('a');
    expect(aHandles?.sourceHandles).toHaveLength(3);
    // Should be spread from 20% to 80%
    expect(aHandles?.sourceHandles[0].position).toBe(20);
    expect(aHandles?.sourceHandles[2].position).toBe(80);
  });

  // ── Node avoidance ────────────────────────────────────────────

  it('avoids intermediate node bounding box when avoidNodes enabled', () => {
    // A at top, C at bottom, B in the middle (not connected)
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'c' }];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),
      makeBounds('b', 50, 120, 200, 80),  // intermediate node at y=120..200
      makeBounds('c', 0, 350, 200, 80),
    ]);
    const result = computeEdgeRouting(edges, bounds, { avoidNodes: true, nodePadding: 10 });

    const assignment = result.edgeAssignments.get('e1');
    expect(assignment).toBeDefined();
    // midY should NOT be within node B's padded vertical span [110, 210]
    const midY = assignment!.midY;
    expect(midY < 110 || midY > 210).toBe(true);
  });

  it('does not avoid nodes when avoidNodes is false', () => {
    const edges: Edge[] = [{ id: 'e1', source: 'a', target: 'c' }];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),
      makeBounds('b', 50, 120, 200, 80),
      makeBounds('c', 0, 350, 200, 80),
    ]);
    const result = computeEdgeRouting(edges, bounds, { avoidNodes: false });
    const assignment = result.edgeAssignments.get('e1');
    expect(assignment).toBeDefined();
    // Without avoidance, midY should be around the center (~215 for sy=80, ty=350)
    const midY = assignment!.midY;
    expect(midY).toBeCloseTo((80 + 350) / 2, -1);
  });

  // ── Horizontal segment deconfliction ──────────────────────────

  it('separates overlapping horizontal segments from different rank pairs', () => {
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'c', target: 'd' },
    ];
    // Both edges span roughly the same vertical range and overlap in X
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),
      makeBounds('b', 0, 200, 200, 80),
      makeBounds('c', 50, 0, 200, 80),
      makeBounds('d', 50, 200, 200, 80),
    ]);
    const result = computeEdgeRouting(edges, bounds, { segmentGap: 8 });

    const midY1 = result.edgeAssignments.get('e1')?.midY;
    const midY2 = result.edgeAssignments.get('e2')?.midY;
    expect(midY1).toBeDefined();
    expect(midY2).toBeDefined();
    expect(Math.abs(midY1! - midY2!)).toBeGreaterThanOrEqual(8);
  });
});
