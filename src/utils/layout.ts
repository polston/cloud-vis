import dagre from 'dagre';
import { type Node, type Edge } from '@xyflow/react';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;
const GROUP_NODE_WIDTH = 280;
const GROUP_NODE_HEIGHT = 100;

export interface HandleInfo {
  id: string;
  position: number; // percentage from left (0–100)
}

/**
 * Compute evenly-spaced handle positions across a node's width.
 * Single connections stay centered; multiple connections spread from 20%–80%.
 */
function computeHandlePositions(count: number): number[] {
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

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
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

  // ── Build a map of node center positions after layout ──────────────
  const nodePositions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node) => {
    const pos = dagreGraph.node(node.id);
    nodePositions.set(node.id, { x: pos.x, y: pos.y });
  });

  // ── Group edges by their source / target node ─────────────────────
  const outgoingEdges = new Map<string, Edge[]>();
  const incomingEdges = new Map<string, Edge[]>();

  edges.forEach((edge) => {
    if (!outgoingEdges.has(edge.source)) outgoingEdges.set(edge.source, []);
    outgoingEdges.get(edge.source)!.push(edge);

    if (!incomingEdges.has(edge.target)) incomingEdges.set(edge.target, []);
    incomingEdges.get(edge.target)!.push(edge);
  });

  // ── Compute handle positions and assign handle IDs to edges ───────
  const nodeSourceHandles = new Map<string, HandleInfo[]>();
  const nodeTargetHandles = new Map<string, HandleInfo[]>();
  const edgeHandleMap = new Map<string, { sourceHandle: string; targetHandle: string }>();

  // Source handles (bottom of nodes in TB layout)
  // Sort outgoing edges by target x-position so left-most targets use left-most handles
  for (const [nodeId, nodeEdges] of outgoingEdges) {
    const sorted = [...nodeEdges].sort((a, b) => {
      const ax = nodePositions.get(a.target)?.x ?? 0;
      const bx = nodePositions.get(b.target)?.x ?? 0;
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

  // Target handles (top of nodes in TB layout)
  // Sort incoming edges by source x-position so left-most sources use left-most handles
  for (const [nodeId, nodeEdges] of incomingEdges) {
    const sorted = [...nodeEdges].sort((a, b) => {
      const ax = nodePositions.get(a.source)?.x ?? 0;
      const bx = nodePositions.get(b.source)?.x ?? 0;
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

  // ── Assemble final nodes with handle metadata ─────────────────────
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isGroup = node.data?.isGroup;
    const width = isGroup ? GROUP_NODE_WIDTH : NODE_WIDTH;
    const height = isGroup ? GROUP_NODE_HEIGHT : NODE_HEIGHT;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
      data: {
        ...node.data,
        sourceHandles: nodeSourceHandles.get(node.id) ?? [],
        targetHandles: nodeTargetHandles.get(node.id) ?? [],
      },
    };
  });

  // ── Assemble final edges with handle assignments ──────────────────
  const layoutedEdges = edges.map((edge) => {
    const handles = edgeHandleMap.get(edge.id);
    return {
      ...edge,
      ...(handles?.sourceHandle ? { sourceHandle: handles.sourceHandle } : {}),
      ...(handles?.targetHandle ? { targetHandle: handles.targetHandle } : {}),
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
