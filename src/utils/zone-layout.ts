import dagre from 'dagre';
import { type Node, type Edge } from '@xyflow/react';
import { computeEdgeRouting } from './edge-routing';

const LEAF_WIDTH = 200;
const LEAF_HEIGHT = 70;
const ZONE_HEADER = 44;
const ZONE_PAD_X = 30;
const ZONE_PAD_Y = 20;
const ZONE_PAD_BOTTOM = 30;

interface SizeInfo {
  width: number;
  height: number;
}

/**
 * Layout a flattened graph with nested zone containers.
 *
 * Strategy: bottom-up Dagre.
 *  1. Find all "leaf" zones (zones whose children are all leaf nodes).
 *  2. Layout their children with Dagre, compute zone size from bounding box.
 *  3. Move up: layout parent zones using the computed child-zone sizes.
 *  4. Repeat until root-level nodes are laid out.
 *  5. Convert all positions to be relative to their parent (React Flow requirement).
 */
export function getZoneLayoutedElements(
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes: [], edges: [] };

  // Build parent-child relationships
  const childrenOf = new Map<string | '__root__', string[]>();
  const nodeById = new Map<string, Node>();
  const isZone = new Set<string>();

  childrenOf.set('__root__', []);

  for (const node of nodes) {
    nodeById.set(node.id, node);
    if (node.type === 'zoneContainer') {
      isZone.add(node.id);
      if (!childrenOf.has(node.id)) childrenOf.set(node.id, []);
    }

    const parentId = (node as Node & { parentId?: string }).parentId;
    const parentKey = parentId ?? '__root__';
    if (!childrenOf.has(parentKey)) childrenOf.set(parentKey, []);
    childrenOf.get(parentKey)!.push(node.id);
  }

  // Computed sizes for each node (zones get computed, leaves use defaults)
  const sizeOf = new Map<string, SizeInfo>();

  // Set leaf node sizes
  for (const node of nodes) {
    if (!isZone.has(node.id)) {
      sizeOf.set(node.id, { width: LEAF_WIDTH, height: LEAF_HEIGHT });
    }
  }

  // Build edges index: edges relevant to a given parent zone
  const edgesInZone = new Map<string, Edge[]>();
  edgesInZone.set('__root__', []);
  for (const zId of isZone) edgesInZone.set(zId, []);

  for (const edge of edges) {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) continue;

    const srcParent = (sourceNode as Node & { parentId?: string }).parentId ?? '__root__';
    const tgtParent = (targetNode as Node & { parentId?: string }).parentId ?? '__root__';

    // Only include edge if both endpoints share the same parent zone
    if (srcParent === tgtParent) {
      if (!edgesInZone.has(srcParent)) edgesInZone.set(srcParent, []);
      edgesInZone.get(srcParent)!.push(edge);
    }
  }

  // Topological order: process zones whose children all have known sizes first
  const processed = new Set<string>();
  const absolutePositions = new Map<string, { x: number; y: number }>();

  function canProcess(zoneId: string): boolean {
    const children = childrenOf.get(zoneId) ?? [];
    for (const cid of children) {
      if (isZone.has(cid) && !processed.has(cid)) return false;
    }
    return true;
  }

  function layoutChildren(parentKey: string) {
    const children = childrenOf.get(parentKey) ?? [];
    if (children.length === 0) {
      if (isZone.has(parentKey)) {
        sizeOf.set(parentKey, { width: 180, height: ZONE_HEADER + 40 });
      }
      return;
    }

    const zoneEdges = edgesInZone.get(parentKey) ?? [];

    // Dynamic spacing based on edge density within this zone
    let maxFan = 0;
    for (const cid of children) {
      const fan = zoneEdges.filter(e => e.source === cid || e.target === cid).length;
      maxFan = Math.max(maxFan, fan);
    }
    const nodesep = Math.min(50 + Math.max(0, maxFan - 3) * 15, 150);
    const ranksep = Math.min(70 + Math.max(0, maxFan - 3) * 20, 200);

    // Run Dagre on this group's children
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: 'TB',
      nodesep,
      ranksep,
      marginx: 20,
      marginy: 20,
    });

    for (const cid of children) {
      const s = sizeOf.get(cid) ?? { width: LEAF_WIDTH, height: LEAF_HEIGHT };
      g.setNode(cid, { width: s.width, height: s.height });
    }

    for (const edge of zoneEdges) {
      if (children.includes(edge.source) && children.includes(edge.target)) {
        g.setEdge(edge.source, edge.target);
      }
    }

    dagre.layout(g);

    // Extract positions (Dagre gives center positions)
    const positions = new Map<string, { x: number; y: number }>();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const cid of children) {
      const dagreNode = g.node(cid);
      if (!dagreNode) continue;
      const s = sizeOf.get(cid) ?? { width: LEAF_WIDTH, height: LEAF_HEIGHT };
      const x = dagreNode.x - s.width / 2;
      const y = dagreNode.y - s.height / 2;
      positions.set(cid, { x, y });

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + s.width);
      maxY = Math.max(maxY, y + s.height);
    }

    // Normalize positions to start from (ZONE_PAD_X, ZONE_HEADER + ZONE_PAD_Y)
    const offsetX = ZONE_PAD_X - minX;
    const headerOffset = parentKey === '__root__' ? 0 : ZONE_HEADER;
    const offsetY = headerOffset + ZONE_PAD_Y - minY;

    for (const cid of children) {
      const pos = positions.get(cid)!;
      positions.set(cid, { x: pos.x + offsetX, y: pos.y + offsetY });
    }

    // Store positions
    for (const [cid, pos] of positions) {
      // For React Flow, these are relative to parent
      absolutePositions.set(cid, pos);
    }

    // Compute zone size
    if (isZone.has(parentKey)) {
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const zoneWidth = contentWidth + ZONE_PAD_X * 2;
      const zoneHeight = contentHeight + headerOffset + ZONE_PAD_Y + ZONE_PAD_BOTTOM;
      sizeOf.set(parentKey, {
        width: Math.max(zoneWidth, 180),
        height: Math.max(zoneHeight, ZONE_HEADER + 40),
      });
    }

    processed.add(parentKey);
  }

  // Process zones bottom-up
  const allZones = [...isZone];
  let safety = 0;
  while (allZones.some((z) => !processed.has(z)) && safety < 100) {
    safety++;
    for (const z of allZones) {
      if (!processed.has(z) && canProcess(z)) {
        layoutChildren(z);
      }
    }
  }

  // Layout root-level nodes
  layoutChildren('__root__');

  // Build final nodes
  const layoutedNodes = nodes.map((node) => {
    const pos = absolutePositions.get(node.id) ?? { x: 0, y: 0 };
    const size = sizeOf.get(node.id);

    const result: Node = {
      ...node,
      position: pos,
    };

    if (isZone.has(node.id) && size) {
      result.style = {
        ...result.style,
        width: size.width,
        height: size.height,
      };
    } else {
      result.style = {
        ...result.style,
        width: LEAF_WIDTH,
        height: LEAF_HEIGHT,
      };
    }

    return result;
  });

  // Sort: parent zones must come before their children for React Flow
  const nodeOrder = new Map<string, number>();
  function assignOrder(nodeId: string, depth: number) {
    nodeOrder.set(nodeId, depth);
    const children = childrenOf.get(nodeId) ?? [];
    for (const cid of children) {
      assignOrder(cid, depth + 1);
    }
  }
  for (const rootChild of childrenOf.get('__root__') ?? []) {
    assignOrder(rootChild, 0);
  }

  layoutedNodes.sort((a, b) => {
    const aIsZone = isZone.has(a.id) ? 0 : 1;
    const bIsZone = isZone.has(b.id) ? 0 : 1;
    if (aIsZone !== bIsZone) return aIsZone - bIsZone;
    const aOrder = nodeOrder.get(a.id) ?? 0;
    const bOrder = nodeOrder.get(b.id) ?? 0;
    return aOrder - bOrder;
  });

  // ── Edge routing: handle spreading, midY offsets, label collision ──
  // Build absolute position map by walking parent chain
  const absoluteBoundsMap = new Map<string, { x: number; y: number; w: number; h: number }>();

  function getAbsolutePosition(nodeId: string): { x: number; y: number } {
    const node = nodeById.get(nodeId);
    const relPos = absolutePositions.get(nodeId) ?? { x: 0, y: 0 };
    const parentId = (node as Node & { parentId?: string } | undefined)?.parentId;
    if (!parentId) return relPos;
    const parentAbs = getAbsolutePosition(parentId);
    return { x: relPos.x + parentAbs.x, y: relPos.y + parentAbs.y };
  }

  for (const node of layoutedNodes) {
    if (isZone.has(node.id)) continue; // only route to/from leaf nodes
    const absPos = getAbsolutePosition(node.id);
    const size = sizeOf.get(node.id) ?? { width: LEAF_WIDTH, height: LEAF_HEIGHT };
    absoluteBoundsMap.set(node.id, { x: absPos.x, y: absPos.y, w: size.width, h: size.height });
  }

  // Only route intra-zone edges (edges where both endpoints are leaf nodes)
  const routableEdges = edges.filter(e => absoluteBoundsMap.has(e.source) && absoluteBoundsMap.has(e.target));

  const routing = computeEdgeRouting(routableEdges, absoluteBoundsMap, { avoidNodes: true });

  // Inject handle data into leaf nodes
  for (const node of layoutedNodes) {
    const handles = routing.nodeHandles.get(node.id);
    if (handles) {
      node.data = { ...node.data, ...handles };
    }
  }

  // Inject routing data into edges
  const routedEdges = edges.map(edge => {
    const assignment = routing.edgeAssignments.get(edge.id);
    if (!assignment) return edge;
    return {
      ...edge,
      sourceHandle: assignment.sourceHandle,
      targetHandle: assignment.targetHandle,
      data: {
        ...edge.data,
        midY: assignment.midY,
        relativeMidY: assignment.relativeMidY,
        ...(assignment.labelOffset !== undefined ? { labelOffset: assignment.labelOffset } : {}),
      },
    };
  });

  return { nodes: layoutedNodes, edges: routedEdges };
}
