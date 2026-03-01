import dagre from 'dagre';
import { type Node, type Edge } from '@xyflow/react';
import { computeEdgeRouting, type NodeBounds } from './edge-routing';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;
const GROUP_NODE_WIDTH = 280;
const GROUP_NODE_HEIGHT = 100;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: Node[]; edges: Edge[] } {
  // ── Dynamic spacing based on edge density ─────────────────────────
  const edgeCounts = new Map<string, number>();
  for (const edge of edges) {
    edgeCounts.set(edge.source, (edgeCounts.get(edge.source) ?? 0) + 1);
    edgeCounts.set(edge.target, (edgeCounts.get(edge.target) ?? 0) + 1);
  }
  let maxFan = 0;
  for (const count of edgeCounts.values()) {
    maxFan = Math.max(maxFan, count);
  }
  const nodesep = Math.min(80 + Math.max(0, maxFan - 3) * 20, 200);
  const ranksep = Math.min(100 + Math.max(0, maxFan - 3) * 25, 250);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep,
    ranksep,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    const isGroup = node.data?.isGroup;
    dagreGraph.setNode(node.id, {
      width: isGroup ? GROUP_NODE_WIDTH : NODE_WIDTH,
      height: isGroup ? GROUP_NODE_HEIGHT : NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // ── Build node bounds from Dagre positions ─────────────────────────
  const nodeBoundsMap = new Map<string, NodeBounds>();
  for (const node of nodes) {
    const isGroup = node.data?.isGroup;
    const w = isGroup ? GROUP_NODE_WIDTH : NODE_WIDTH;
    const h = isGroup ? GROUP_NODE_HEIGHT : NODE_HEIGHT;
    const center = dagreGraph.node(node.id);
    if (!center) continue;
    nodeBoundsMap.set(node.id, {
      x: center.x - w / 2,
      y: center.y - h / 2,
      w,
      h,
    });
  }

  // ── Edge routing (handles, midY, labels, collision avoidance) ──────
  const routing = computeEdgeRouting(edges, nodeBoundsMap, { avoidNodes: true });

  // ── Assemble final nodes with handle metadata ──────────────────────
  const layoutedNodes = nodes.map((node) => {
    const bounds = nodeBoundsMap.get(node.id);
    const handles = routing.nodeHandles.get(node.id);

    return {
      ...node,
      position: bounds
        ? { x: bounds.x, y: bounds.y }
        : node.position,
      data: {
        ...node.data,
        sourceHandles: handles?.sourceHandles ?? [],
        targetHandles: handles?.targetHandles ?? [],
      },
    };
  });

  // ── Assemble final edges with routing data ─────────────────────────
  const layoutedEdges = edges.map((edge) => {
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

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
