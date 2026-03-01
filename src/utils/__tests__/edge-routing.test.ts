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

  it('spreads from 15 to 85 for two connections', () => {
    const pos = computeHandlePositions(2);
    expect(pos).toEqual([15, 85]);
  });

  it('spreads evenly for three connections', () => {
    const pos = computeHandlePositions(3);
    expect(pos[0]).toBe(15);
    expect(pos[1]).toBe(50);
    expect(pos[2]).toBe(85);
  });

  it('handles large fan-out', () => {
    const pos = computeHandlePositions(7);
    expect(pos).toHaveLength(7);
    expect(pos[0]).toBe(15);
    expect(pos[6]).toBe(85);
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
    // Should be spread from 15% to 85%
    expect(aHandles?.sourceHandles[0].position).toBe(15);
    expect(aHandles?.sourceHandles[2].position).toBe(85);
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

  it('applies default segmentGap of 20 when no option is passed', () => {
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'c', target: 'd' },
    ];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),
      makeBounds('b', 0, 300, 200, 80),
      makeBounds('c', 50, 0, 200, 80),
      makeBounds('d', 50, 300, 200, 80),
    ]);
    const result = computeEdgeRouting(edges, bounds);

    const midY1 = result.edgeAssignments.get('e1')?.midY;
    const midY2 = result.edgeAssignments.get('e2')?.midY;
    expect(midY1).toBeDefined();
    expect(midY2).toBeDefined();
    expect(Math.abs(midY1! - midY2!)).toBeGreaterThanOrEqual(20);
  });

  // ── Multi-pass convergence ─────────────────────────────────────

  it('resolves cascading horizontal conflicts across multiple passes', () => {
    // Three edges with overlapping X ranges that need multiple passes
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'c', target: 'd' },
      { id: 'e3', source: 'f', target: 'g' },
    ];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),
      makeBounds('b', 0, 300, 200, 80),
      makeBounds('c', 50, 0, 200, 80),
      makeBounds('d', 50, 300, 200, 80),
      makeBounds('f', 25, 0, 200, 80),
      makeBounds('g', 25, 300, 200, 80),
    ]);
    const result = computeEdgeRouting(edges, bounds, { segmentGap: 15 });

    const midYs = ['e1', 'e2', 'e3'].map(id =>
      result.edgeAssignments.get(id)?.midY
    ).filter((v): v is number => v !== undefined);

    expect(midYs).toHaveLength(3);
    midYs.sort((a, b) => a - b);
    // All pairwise gaps should be >= segmentGap
    for (let i = 1; i < midYs.length; i++) {
      expect(midYs[i] - midYs[i - 1]).toBeGreaterThanOrEqual(14.5); // allow small float tolerance
    }
  });

  // ── Horizontal-vs-vertical crossing ────────────────────────────

  it('avoids horizontal segment crossing through another edge vertical segment', () => {
    // Edge e1: horizontal at midY that could cross e2's vertical drop
    // e1 goes from left to right, e2 drops vertically through the middle
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'c', target: 'd' },
    ];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),
      makeBounds('b', 400, 300, 200, 80),
      makeBounds('c', 200, 0, 200, 80),   // c is directly above d
      makeBounds('d', 200, 300, 200, 80),
    ]);
    const result = computeEdgeRouting(edges, bounds);

    const midY1 = result.edgeAssignments.get('e1')?.midY;
    const midY2 = result.edgeAssignments.get('e2')?.midY;
    expect(midY1).toBeDefined();
    expect(midY2).toBeDefined();

    // e2's vertical drops at x=300 (center of node c/d which is at x=200, w=200)
    // e1's horizontal should not be at the same Y as e2's vertical segment range
    // At minimum they should be separated by some gap
    const e2SourceBottom = 80; // y=0 + h=80
    const e2TargetTop = 300;   // y=300
    if (midY1! > e2SourceBottom && midY1! < e2TargetTop) {
      // If e1's horizontal is within e2's vertical range, it should be
      // offset from e2's midY by at least some gap
      expect(Math.abs(midY1! - midY2!)).toBeGreaterThan(5);
    }
  });

  // ── Common-endpoint midY spreading ──────────────────────────────

  it('spreads midY for edges converging to the same target node', () => {
    // Two edges from different sources converge to the same target (like Route53 → ELB and CloudWatch → ELB)
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'c' },
      { id: 'e2', source: 'b', target: 'c' },
    ];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),     // source 1 at top-left
      makeBounds('b', 300, 0, 200, 80),    // source 2 at top-right
      makeBounds('c', 150, 300, 200, 80),  // shared target at bottom-center
    ]);
    const result = computeEdgeRouting(edges, bounds);

    const midY1 = result.edgeAssignments.get('e1')?.midY;
    const midY2 = result.edgeAssignments.get('e2')?.midY;
    expect(midY1).toBeDefined();
    expect(midY2).toBeDefined();
    // Edges sharing a target should have significantly different midY values
    expect(Math.abs(midY1! - midY2!)).toBeGreaterThanOrEqual(20);
  });

  it('spreads midY for edges diverging from the same source node', () => {
    // Three edges fan out from the same source (like ELB → EKS, EC2, Lambda)
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'a', target: 'c' },
      { id: 'e3', source: 'a', target: 'd' },
    ];
    const bounds = new Map([
      makeBounds('a', 200, 0, 200, 80),    // source at top-center
      makeBounds('b', 0, 300, 200, 80),     // target left
      makeBounds('c', 200, 300, 200, 80),   // target center
      makeBounds('d', 400, 300, 200, 80),   // target right
    ]);
    const result = computeEdgeRouting(edges, bounds);

    const midYs = ['e1', 'e2', 'e3'].map(id =>
      result.edgeAssignments.get(id)?.midY
    ).filter((v): v is number => v !== undefined);

    expect(midYs).toHaveLength(3);
    midYs.sort((a, b) => a - b);
    // All pairwise gaps should show separation
    for (let i = 1; i < midYs.length; i++) {
      expect(midYs[i] - midYs[i - 1]).toBeGreaterThan(10);
    }
  });

  it('gracefully degrades when vertical space is too tight for full spreading', () => {
    // Two edges sharing a target with limited vertical space.
    // Band = [sy+25, ty-25] = [105, 115] = only 10px, less than desiredGap of 20.
    // The function should reduce the gap proportionally.
    const edges: Edge[] = [
      { id: 'e1', source: 'a', target: 'c' },
      { id: 'e2', source: 'b', target: 'c' },
    ];
    const bounds = new Map([
      makeBounds('a', 0, 0, 200, 80),       // bottom at y=80
      makeBounds('b', 250, 0, 200, 80),      // bottom at y=80
      makeBounds('c', 100, 140, 200, 80),    // top at y=140 → band [105, 115]
    ]);
    const result = computeEdgeRouting(edges, bounds);

    const midY1 = result.edgeAssignments.get('e1')?.midY;
    const midY2 = result.edgeAssignments.get('e2')?.midY;
    expect(midY1).toBeDefined();
    expect(midY2).toBeDefined();
    // Even in tight space, midY values should still differ (reduced gap)
    expect(Math.abs(midY1! - midY2!)).toBeGreaterThan(5);
    // But the gap is smaller than the full desiredGap of 20
    expect(Math.abs(midY1! - midY2!)).toBeLessThan(20);
  });
});
