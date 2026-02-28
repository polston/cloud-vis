import { type Edge } from '@xyflow/react';

export interface HandleInfo {
  id: string;
  position: number; // percentage from left (0–100)
}

interface NodeBounds {
  x: number; // top-left x
  y: number; // top-left y
  w: number;
  h: number;
}

interface Segment { x1: number; y1: number; x2: number; y2: number }

/**
 * Compute evenly-spaced handle positions across a node's width.
 * Single connections stay centered; multiple connections spread from 20%–80%.
 */
export function computeHandlePositions(count: number): number[] {
  if (count === 0) return [];
  if (count === 1) return [50];

  const MIN_PCT = 20;
  const MAX_PCT = 80;
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    positions.push(MIN_PCT + (MAX_PCT - MIN_PCT) * (i / (count - 1)));
  }
  return positions;
}

export interface EdgeRoutingResult {
  /** Per-node handle assignments */
  nodeHandles: Map<string, { sourceHandles: HandleInfo[]; targetHandles: HandleInfo[] }>;
  /** Per-edge routing data */
  edgeAssignments: Map<string, {
    sourceHandle: string;
    targetHandle: string;
    midY: number;
    labelOffset?: number;
  }>;
}

/**
 * Compute edge routing for a set of nodes and edges.
 * Assigns handles, computes per-edge midY offsets, and label collision avoidance.
 *
 * @param edges - The edges to route
 * @param nodeBoundsMap - Map of node ID to absolute bounding box (top-left + size)
 */
export function computeEdgeRouting(
  edges: Edge[],
  nodeBoundsMap: Map<string, NodeBounds>
): EdgeRoutingResult {
  const nodeHandles = new Map<string, { sourceHandles: HandleInfo[]; targetHandles: HandleInfo[] }>();
  const edgeAssignments = new Map<string, { sourceHandle: string; targetHandle: string; midY: number; labelOffset?: number }>();

  if (edges.length === 0) return { nodeHandles, edgeAssignments };

  // ── Group edges by their source / target node ─────────────────────
  const outgoingEdges = new Map<string, Edge[]>();
  const incomingEdges = new Map<string, Edge[]>();

  for (const edge of edges) {
    if (!outgoingEdges.has(edge.source)) outgoingEdges.set(edge.source, []);
    outgoingEdges.get(edge.source)!.push(edge);

    if (!incomingEdges.has(edge.target)) incomingEdges.set(edge.target, []);
    incomingEdges.get(edge.target)!.push(edge);
  }

  // ── Compute handle positions and assign handle IDs to edges ───────
  const nodeSourceHandles = new Map<string, HandleInfo[]>();
  const nodeTargetHandles = new Map<string, HandleInfo[]>();
  const edgeHandleMap = new Map<string, { sourceHandle: string; targetHandle: string }>();

  // Source handles: sort outgoing edges by target x-position
  for (const [nodeId, nodeEdges] of outgoingEdges) {
    const sorted = [...nodeEdges].sort((a, b) => {
      const ax = nodeBoundsMap.get(a.target)?.x ?? 0;
      const bx = nodeBoundsMap.get(b.target)?.x ?? 0;
      return ax - bx;
    });

    const positions = computeHandlePositions(sorted.length);
    const handleInfos: HandleInfo[] = [];

    sorted.forEach((edge, i) => {
      const handleId = `source-${i}`;
      handleInfos.push({ id: handleId, position: positions[i] });

      if (!edgeHandleMap.has(edge.id)) {
        edgeHandleMap.set(edge.id, { sourceHandle: '', targetHandle: '' });
      }
      edgeHandleMap.get(edge.id)!.sourceHandle = handleId;
    });

    nodeSourceHandles.set(nodeId, handleInfos);
  }

  // Target handles: sort incoming edges by source x-position
  for (const [nodeId, nodeEdges] of incomingEdges) {
    const sorted = [...nodeEdges].sort((a, b) => {
      const ax = nodeBoundsMap.get(a.source)?.x ?? 0;
      const bx = nodeBoundsMap.get(b.source)?.x ?? 0;
      return ax - bx;
    });

    const positions = computeHandlePositions(sorted.length);
    const handleInfos: HandleInfo[] = [];

    sorted.forEach((edge, i) => {
      const handleId = `target-${i}`;
      handleInfos.push({ id: handleId, position: positions[i] });

      if (!edgeHandleMap.has(edge.id)) {
        edgeHandleMap.set(edge.id, { sourceHandle: '', targetHandle: '' });
      }
      edgeHandleMap.get(edge.id)!.targetHandle = handleId;
    });

    nodeTargetHandles.set(nodeId, handleInfos);
  }

  // Build nodeHandles output
  const allNodeIds = new Set<string>();
  for (const edge of edges) {
    allNodeIds.add(edge.source);
    allNodeIds.add(edge.target);
  }
  for (const nodeId of allNodeIds) {
    nodeHandles.set(nodeId, {
      sourceHandles: nodeSourceHandles.get(nodeId) ?? [],
      targetHandles: nodeTargetHandles.get(nodeId) ?? [],
    });
  }

  // ── Compute per-edge midY offsets ─────────────────────────────────
  interface EdgeCoords { edge: Edge; sx: number; sy: number; tx: number; ty: number }
  const edgeCoords = new Map<string, EdgeCoords>();

  for (const edge of edges) {
    const sn = nodeBoundsMap.get(edge.source);
    const tn = nodeBoundsMap.get(edge.target);
    if (!sn || !tn) continue;

    const handles = edgeHandleMap.get(edge.id);
    const sHandles = nodeSourceHandles.get(edge.source) ?? [];
    const tHandles = nodeTargetHandles.get(edge.target) ?? [];
    const sHandle = sHandles.find((h) => h.id === handles?.sourceHandle);
    const tHandle = tHandles.find((h) => h.id === handles?.targetHandle);

    const sx = sn.x + sn.w * (sHandle?.position ?? 50) / 100;
    const sy = sn.y + sn.h;
    const tx = tn.x + tn.w * (tHandle?.position ?? 50) / 100;
    const ty = tn.y;

    edgeCoords.set(edge.id, { edge, sx, sy, tx, ty });
  }

  const RANK_QUANT = 10;
  const edgesByRankPair = new Map<string, EdgeCoords[]>();

  for (const coords of edgeCoords.values()) {
    const rankKey = `${Math.round(coords.sy / RANK_QUANT) * RANK_QUANT}:${Math.round(coords.ty / RANK_QUANT) * RANK_QUANT}`;
    if (!edgesByRankPair.has(rankKey)) edgesByRankPair.set(rankKey, []);
    edgesByRankPair.get(rankKey)!.push(coords);
  }

  const GAP_MARGIN = 15;
  // Minimum vertical distance between an edge's midY and its own source/target
  // endpoint.  Must exceed getSmoothStepPath's borderRadius (default 5) to
  // prevent the rounded corner from "coiling" in a too-short vertical segment.
  const MIN_BEND_DISTANCE = 25;
  const edgeMidY = new Map<string, number>();

  for (const [, group] of edgesByRankPair) {
    group.sort((a, b) => ((a.sx + a.tx) / 2) - ((b.sx + b.tx) / 2));

    if (group.length === 1) {
      edgeMidY.set(group[0].edge.id, (group[0].sy + group[0].ty) / 2);
    } else {
      const avgSy = group.reduce((s, g) => s + g.sy, 0) / group.length;
      const avgTy = group.reduce((s, g) => s + g.ty, 0) / group.length;
      const bandTop = avgSy + GAP_MARGIN;
      const bandBottom = avgTy - GAP_MARGIN;

      if (bandBottom <= bandTop) {
        for (const g of group) {
          edgeMidY.set(g.edge.id, (g.sy + g.ty) / 2);
        }
      } else {
        for (let i = 0; i < group.length; i++) {
          let midY = bandTop + (bandBottom - bandTop) * (i / (group.length - 1));
          // Clamp to stay MIN_BEND_DISTANCE from this edge's own endpoints
          const lowerBound = group[i].sy + MIN_BEND_DISTANCE;
          const upperBound = group[i].ty - MIN_BEND_DISTANCE;
          if (lowerBound < upperBound) {
            midY = Math.max(lowerBound, Math.min(upperBound, midY));
          } else {
            midY = (group[i].sy + group[i].ty) / 2;
          }
          edgeMidY.set(group[i].edge.id, midY);
        }
      }
    }
  }

  // ── Edge segments for label collision avoidance ────────────────────
  function edgeSegments(edgeId: string): Segment[] {
    const coords = edgeCoords.get(edgeId);
    if (!coords) return [];

    const { sx, sy, tx, ty } = coords;
    const midY = edgeMidY.get(edgeId) ?? (sy + ty) / 2;

    return [
      { x1: sx, y1: sy, x2: sx, y2: midY },
      { x1: sx, y1: midY, x2: tx, y2: midY },
      { x1: tx, y1: midY, x2: tx, y2: ty },
    ];
  }

  function pointOnPath(segs: Segment[], t: number): { x: number; y: number } {
    let total = 0;
    const lens: number[] = [];
    for (const s of segs) {
      const l = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
      lens.push(l);
      total += l;
    }
    const dist = t * total;
    let acc = 0;
    for (let i = 0; i < segs.length; i++) {
      if (acc + lens[i] >= dist || i === segs.length - 1) {
        const st = lens[i] > 0 ? (dist - acc) / lens[i] : 0;
        return {
          x: segs[i].x1 + st * (segs[i].x2 - segs[i].x1),
          y: segs[i].y1 + st * (segs[i].y2 - segs[i].y1),
        };
      }
      acc += lens[i];
    }
    return { x: segs[0]?.x1 ?? 0, y: segs[0]?.y1 ?? 0 };
  }

  function rectIntersectsSegment(
    rx: number, ry: number, rw: number, rh: number,
    seg: Segment
  ): boolean {
    let t0 = 0, t1 = 1;
    const dx = seg.x2 - seg.x1;
    const dy = seg.y2 - seg.y1;
    const p = [-dx, dx, -dy, dy];
    const q = [seg.x1 - rx, rx + rw - seg.x1, seg.y1 - ry, ry + rh - seg.y1];
    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) {
        if (q[i] < 0) return false;
      } else {
        const r = q[i] / p[i];
        if (p[i] < 0) { t0 = Math.max(t0, r); }
        else { t1 = Math.min(t1, r); }
        if (t0 > t1) return false;
      }
    }
    return true;
  }

  const allEdgeSegs = new Map<string, Segment[]>();
  for (const edge of edges) {
    allEdgeSegs.set(edge.id, edgeSegments(edge.id));
  }

  const CHAR_WIDTH = 6;
  const LABEL_PAD = 10;
  const LABEL_HEIGHT = 20;
  const CANDIDATES = [0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85];

  const edgeLabelOffsets = new Map<string, number>();
  for (const edge of edges) {
    if (!edge.label) continue;
    const segs = allEdgeSegs.get(edge.id);
    if (!segs || segs.length === 0) continue;

    const text = typeof edge.label === 'string' ? edge.label : '';
    const labelW = text.length * CHAR_WIDTH + LABEL_PAD * 2;

    // Collect segments from other edges
    const others: Segment[] = [];
    for (const [id, s] of allEdgeSegs) {
      if (id !== edge.id) others.push(...s);
    }

    let bestOffset = 0.5;
    for (const t of CANDIDATES) {
      const pt = pointOnPath(segs, t);
      const rx = pt.x - labelW / 2;
      const ry = pt.y - LABEL_HEIGHT / 2;
      let hit = false;
      for (const seg of others) {
        if (rectIntersectsSegment(rx, ry, labelW, LABEL_HEIGHT, seg)) {
          hit = true;
          break;
        }
      }
      if (!hit) {
        bestOffset = t;
        break;
      }
    }
    edgeLabelOffsets.set(edge.id, bestOffset);
  }

  // ── Build final assignments ───────────────────────────────────────
  for (const edge of edges) {
    const handles = edgeHandleMap.get(edge.id);
    const midY = edgeMidY.get(edge.id);
    const labelOffset = edgeLabelOffsets.get(edge.id);

    if (handles && midY !== undefined) {
      edgeAssignments.set(edge.id, {
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        midY,
        ...(labelOffset !== undefined ? { labelOffset } : {}),
      });
    }
  }

  return { nodeHandles, edgeAssignments };
}
