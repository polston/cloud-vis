import { type Edge } from '@xyflow/react';

// ── Shared types ─────────────────────────────────────────────────
export interface HandleInfo {
  id: string;
  position: number; // percentage from left (0–100)
}

export interface NodeBounds {
  x: number; // top-left x
  y: number; // top-left y
  w: number;
  h: number;
}

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface EdgeRoutingOptions {
  avoidNodes?: boolean;
  nodePadding?: number;    // clearance around nodes (default 10)
  segmentGap?: number;     // min vertical gap between horizontal segments (default 8)
  minBendDistance?: number; // min vertical distance from endpoints (default 25)
}

export interface EdgeRoutingResult {
  /** Per-node handle assignments */
  nodeHandles: Map<string, { sourceHandles: HandleInfo[]; targetHandles: HandleInfo[] }>;
  /** Per-edge routing data */
  edgeAssignments: Map<string, {
    sourceHandle: string;
    targetHandle: string;
    midY: number;
    relativeMidY: number;
    labelOffset?: number;
  }>;
}

/**
 * An edge router takes positioned nodes and edges, and produces
 * handle assignments + routing parameters for each edge.
 * Swap implementations to change the routing algorithm.
 */
export type EdgeRouter = (
  edges: Edge[],
  nodeBoundsMap: Map<string, NodeBounds>,
  options?: EdgeRoutingOptions
) => EdgeRoutingResult;

// ── Handle position computation ──────────────────────────────────

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

// ── Geometry utilities ───────────────────────────────────────────

/** Liang-Barsky line-segment vs axis-aligned-rect intersection test */
export function rectIntersectsSegment(
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

/** Get a point at parameter t (0-1) along a series of segments */
export function pointOnPath(segs: Segment[], t: number): { x: number; y: number } {
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

// ── Edge coordinate helpers ──────────────────────────────────────

interface EdgeCoords {
  edge: Edge;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
}

function buildEdgeSegments(
  sx: number, sy: number, tx: number, ty: number, midY: number
): Segment[] {
  return [
    { x1: sx, y1: sy, x2: sx, y2: midY },
    { x1: sx, y1: midY, x2: tx, y2: midY },
    { x1: tx, y1: midY, x2: tx, y2: ty },
  ];
}

// ── Node avoidance ───────────────────────────────────────────────

function avoidNodes(
  edgeMidY: Map<string, number>,
  edgeCoords: Map<string, EdgeCoords>,
  nodeBoundsMap: Map<string, NodeBounds>,
  edges: Edge[],
  minBendDistance: number,
  padding: number
): void {
  for (const edge of edges) {
    const coords = edgeCoords.get(edge.id);
    if (!coords) continue;

    const currentMidY = edgeMidY.get(edge.id);
    if (currentMidY === undefined) continue;

    const { sx, sy, tx, ty } = coords;
    const hSegMinX = Math.min(sx, tx);
    const hSegMaxX = Math.max(sx, tx);

    for (const [nodeId, bounds] of nodeBoundsMap) {
      if (nodeId === edge.source || nodeId === edge.target) continue;

      const nodeLeft = bounds.x - padding;
      const nodeRight = bounds.x + bounds.w + padding;
      const nodeTop = bounds.y - padding;
      const nodeBottom = bounds.y + bounds.h + padding;

      // Check horizontal overlap
      if (hSegMaxX < nodeLeft || hSegMinX > nodeRight) continue;
      // Check vertical overlap (is midY within the node's padded bounds?)
      if (currentMidY < nodeTop || currentMidY > nodeBottom) continue;

      // Collision detected — try routing above or below the node
      const aboveMidY = nodeTop - 1;
      const belowMidY = nodeBottom + 1;

      const lowerBound = sy + minBendDistance;
      const upperBound = ty - minBendDistance;

      const aboveValid = aboveMidY >= lowerBound && aboveMidY <= upperBound;
      const belowValid = belowMidY >= lowerBound && belowMidY <= upperBound;

      if (aboveValid && belowValid) {
        edgeMidY.set(edge.id,
          Math.abs(aboveMidY - currentMidY) <= Math.abs(belowMidY - currentMidY)
            ? aboveMidY : belowMidY
        );
      } else if (aboveValid) {
        edgeMidY.set(edge.id, aboveMidY);
      } else if (belowValid) {
        edgeMidY.set(edge.id, belowMidY);
      }
      // If neither is valid, keep the original (tight layout, nothing we can do)
      break; // Handle first collision per edge
    }
  }
}

// ── Horizontal segment deconfliction ─────────────────────────────

function resolveHorizontalOverlaps(
  edgeMidY: Map<string, number>,
  edgeCoords: Map<string, EdgeCoords>,
  edges: Edge[],
  minBendDistance: number,
  segmentGap: number
): void {
  interface HSegment {
    edgeId: string;
    midY: number;
    minX: number;
    maxX: number;
    sy: number;
    ty: number;
  }

  const hSegments: HSegment[] = [];
  for (const edge of edges) {
    const coords = edgeCoords.get(edge.id);
    const midY = edgeMidY.get(edge.id);
    if (!coords || midY === undefined) continue;
    hSegments.push({
      edgeId: edge.id,
      midY,
      minX: Math.min(coords.sx, coords.tx),
      maxX: Math.max(coords.sx, coords.tx),
      sy: coords.sy,
      ty: coords.ty,
    });
  }

  const MAX_ITERATIONS = 5;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    hSegments.sort((a, b) => a.midY - b.midY);
    let anyAdjusted = false;

    for (let i = 1; i < hSegments.length; i++) {
      const prev = hSegments[i - 1];
      const curr = hSegments[i];

      // Only separate if their X ranges overlap
      const xOverlap = curr.minX < prev.maxX && curr.maxX > prev.minX;
      if (!xOverlap) continue;

      const gap = curr.midY - prev.midY;
      if (gap < segmentGap) {
        const newMidY = prev.midY + segmentGap;
        const clamped = Math.max(
          curr.sy + minBendDistance,
          Math.min(curr.ty - minBendDistance, newMidY)
        );
        if (Math.abs(clamped - curr.midY) > 0.5) {
          edgeMidY.set(curr.edgeId, clamped);
          curr.midY = clamped;
          anyAdjusted = true;
        }
      }
    }

    if (!anyAdjusted) break;
  }
}

// ── Horizontal-vs-vertical crossing resolution ───────────────────

interface EdgeGeometry {
  edgeId: string;
  sx: number; sy: number; tx: number; ty: number;
  midY: number;
  hMinX: number; hMaxX: number;
}

function checkHVCrossing(
  hEdge: EdgeGeometry,
  vX: number,
  vYTop: number,
  vYBottom: number
): boolean {
  const top = Math.min(vYTop, vYBottom);
  const bot = Math.max(vYTop, vYBottom);
  return (
    vX >= hEdge.hMinX && vX <= hEdge.hMaxX &&
    hEdge.midY >= top && hEdge.midY <= bot
  );
}

function nudgeMidYAway(
  hEdge: EdgeGeometry,
  edgeMidY: Map<string, number>,
  edgeCoords: Map<string, EdgeCoords>,
  minBendDistance: number,
  gap: number
): void {
  const hCoords = edgeCoords.get(hEdge.edgeId);
  if (!hCoords) return;

  const lowerBound = hCoords.sy + minBendDistance;
  const upperBound = hCoords.ty - minBendDistance;

  const upMidY = hEdge.midY - gap;
  const downMidY = hEdge.midY + gap;
  const upValid = upMidY >= lowerBound && upMidY <= upperBound;
  const downValid = downMidY >= lowerBound && downMidY <= upperBound;

  let newMidY = hEdge.midY;
  if (upValid && downValid) {
    const center = (lowerBound + upperBound) / 2;
    newMidY = Math.abs(upMidY - center) < Math.abs(downMidY - center) ? upMidY : downMidY;
  } else if (upValid) {
    newMidY = upMidY;
  } else if (downValid) {
    newMidY = downMidY;
  }

  if (Math.abs(newMidY - hEdge.midY) > 0.5) {
    edgeMidY.set(hEdge.edgeId, newMidY);
    hEdge.midY = newMidY;
  }
}

function resolveHVCrossings(
  edgeMidY: Map<string, number>,
  edgeCoords: Map<string, EdgeCoords>,
  edges: Edge[],
  minBendDistance: number,
  crossingGap: number
): void {
  const geoms: EdgeGeometry[] = [];
  for (const edge of edges) {
    const coords = edgeCoords.get(edge.id);
    const midY = edgeMidY.get(edge.id);
    if (!coords || midY === undefined) continue;
    geoms.push({
      edgeId: edge.id,
      sx: coords.sx, sy: coords.sy, tx: coords.tx, ty: coords.ty,
      midY,
      hMinX: Math.min(coords.sx, coords.tx),
      hMaxX: Math.max(coords.sx, coords.tx),
    });
  }

  for (let i = 0; i < geoms.length; i++) {
    const a = geoms[i];
    for (let j = i + 1; j < geoms.length; j++) {
      const b = geoms[j];

      // Check A's horizontal vs B's source-side vertical
      if (checkHVCrossing(a, b.sx, b.sy, b.midY)) {
        nudgeMidYAway(a, edgeMidY, edgeCoords, minBendDistance, crossingGap);
        continue;
      }
      // Check A's horizontal vs B's target-side vertical
      if (checkHVCrossing(a, b.tx, b.midY, b.ty)) {
        nudgeMidYAway(a, edgeMidY, edgeCoords, minBendDistance, crossingGap);
        continue;
      }
      // Check B's horizontal vs A's source-side vertical
      if (checkHVCrossing(b, a.sx, a.sy, a.midY)) {
        nudgeMidYAway(b, edgeMidY, edgeCoords, minBendDistance, crossingGap);
        continue;
      }
      // Check B's horizontal vs A's target-side vertical
      if (checkHVCrossing(b, a.tx, a.midY, a.ty)) {
        nudgeMidYAway(b, edgeMidY, edgeCoords, minBendDistance, crossingGap);
        continue;
      }
    }
  }
}

// ── Vertical segment proximity detection ─────────────────────────

function resolveVerticalProximity(
  edgeMidY: Map<string, number>,
  edgeCoords: Map<string, EdgeCoords>,
  edges: Edge[],
  minBendDistance: number,
  verticalGap: number
): void {
  interface VSegment {
    edgeId: string;
    x: number;
    yTop: number;
    yBottom: number;
    isSource: boolean;
  }

  const vSegments: VSegment[] = [];
  for (const edge of edges) {
    const coords = edgeCoords.get(edge.id);
    const midY = edgeMidY.get(edge.id);
    if (!coords || midY === undefined) continue;

    vSegments.push({
      edgeId: edge.id,
      x: coords.sx,
      yTop: Math.min(coords.sy, midY),
      yBottom: Math.max(coords.sy, midY),
      isSource: true,
    });
    vSegments.push({
      edgeId: edge.id,
      x: coords.tx,
      yTop: Math.min(midY, coords.ty),
      yBottom: Math.max(midY, coords.ty),
      isSource: false,
    });
  }

  vSegments.sort((a, b) => a.x - b.x);

  for (let i = 0; i < vSegments.length; i++) {
    for (let j = i + 1; j < vSegments.length; j++) {
      const a = vSegments[i];
      const b = vSegments[j];

      if (b.x - a.x > verticalGap) break;
      if (a.edgeId === b.edgeId) continue;

      // Check Y overlap
      const yOverlapTop = Math.max(a.yTop, b.yTop);
      const yOverlapBottom = Math.min(a.yBottom, b.yBottom);
      if (yOverlapTop >= yOverlapBottom) continue;

      const overlapLength = yOverlapBottom - yOverlapTop;
      if (overlapLength < verticalGap) continue;

      // Nudge edge b's midY to reduce the overlap
      const bCoords = edgeCoords.get(b.edgeId);
      const bMidY = edgeMidY.get(b.edgeId);
      if (!bCoords || bMidY === undefined) continue;

      let newMidY: number;
      if (b.isSource) {
        newMidY = bMidY - verticalGap;
      } else {
        newMidY = bMidY + verticalGap;
      }

      const clamped = Math.max(
        bCoords.sy + minBendDistance,
        Math.min(bCoords.ty - minBendDistance, newMidY)
      );

      if (Math.abs(clamped - bMidY) > 1) {
        edgeMidY.set(b.edgeId, clamped);
        if (b.isSource) {
          b.yBottom = Math.max(bCoords.sy, clamped);
        } else {
          b.yTop = Math.min(clamped, bCoords.ty);
        }
      }
    }
  }
}

// ── Main routing function ────────────────────────────────────────

/**
 * Compute edge routing for a set of nodes and edges.
 * Assigns handles, computes per-edge midY offsets, avoids node/edge overlaps,
 * and performs label collision avoidance.
 */
export const computeEdgeRouting: EdgeRouter = function computeEdgeRouting(
  edges: Edge[],
  nodeBoundsMap: Map<string, NodeBounds>,
  options?: EdgeRoutingOptions
): EdgeRoutingResult {
  const {
    avoidNodes: shouldAvoidNodes = false,
    nodePadding = 10,
    segmentGap = 20,
    minBendDistance = 25,
  } = options ?? {};

  const nodeHandles = new Map<string, { sourceHandles: HandleInfo[]; targetHandles: HandleInfo[] }>();
  const edgeAssignments = new Map<string, {
    sourceHandle: string;
    targetHandle: string;
    midY: number;
    relativeMidY: number;
    labelOffset?: number;
  }>();

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

  const GAP_MARGIN = 15;
  const RANK_QUANT = 10;
  const edgesByRankPair = new Map<string, EdgeCoords[]>();

  for (const coords of edgeCoords.values()) {
    const rankKey = `${Math.round(coords.sy / RANK_QUANT) * RANK_QUANT}:${Math.round(coords.ty / RANK_QUANT) * RANK_QUANT}`;
    if (!edgesByRankPair.has(rankKey)) edgesByRankPair.set(rankKey, []);
    edgesByRankPair.get(rankKey)!.push(coords);
  }

  const edgeMidY = new Map<string, number>();

  for (const [, group] of edgesByRankPair) {
    // Sort by source X first, then target X. This aligns with handle spreading
    // (which sorts outgoing handles by target X) and reduces unnecessary crossings
    // compared to sorting by average X center.
    group.sort((a, b) => {
      const dsx = a.sx - b.sx;
      if (Math.abs(dsx) > 1) return dsx;
      return a.tx - b.tx;
    });

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
          const lowerBound = group[i].sy + minBendDistance;
          const upperBound = group[i].ty - minBendDistance;
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

  // ── Phase 1: Node avoidance ─────────────────────────────────────
  if (shouldAvoidNodes) {
    avoidNodes(edgeMidY, edgeCoords, nodeBoundsMap, edges, minBendDistance, nodePadding);
  }

  // ── Phase 2: Horizontal-vs-vertical crossing resolution ────────
  resolveHVCrossings(edgeMidY, edgeCoords, edges, minBendDistance, 10);

  // ── Phase 3: Cross-rank horizontal segment deconfliction ────────
  resolveHorizontalOverlaps(edgeMidY, edgeCoords, edges, minBendDistance, segmentGap);

  // ── Phase 4: Vertical segment proximity detection ──────────────
  resolveVerticalProximity(edgeMidY, edgeCoords, edges, minBendDistance, 12);

  // ── Phase 5: Final horizontal cleanup after vertical nudging ───
  resolveHorizontalOverlaps(edgeMidY, edgeCoords, edges, minBendDistance, segmentGap);

  // ── Edge segments for label collision avoidance ────────────────────
  const allEdgeSegs = new Map<string, Segment[]>();
  for (const edge of edges) {
    const coords = edgeCoords.get(edge.id);
    if (!coords) continue;
    const { sx, sy, tx, ty } = coords;
    const midY = edgeMidY.get(edge.id) ?? (sy + ty) / 2;
    allEdgeSegs.set(edge.id, buildEdgeSegments(sx, sy, tx, ty, midY));
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
    const coords = edgeCoords.get(edge.id);

    if (handles && midY !== undefined && coords) {
      const range = coords.ty - coords.sy;
      const relativeMidY = range > 0 ? (midY - coords.sy) / range : 0.5;

      edgeAssignments.set(edge.id, {
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        midY,
        relativeMidY,
        ...(labelOffset !== undefined ? { labelOffset } : {}),
      });
    }
  }

  return { nodeHandles, edgeAssignments };
};
