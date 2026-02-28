import { useState, useCallback, useMemo, useRef } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { graphRegistry } from '../data/graph-data';
import { getLayoutedElements } from '../utils/layout';
import { flattenGraph, buildNodeParentMap, isCrossZoneEdge, parentMap } from '../utils/graph-flattener';
import { getZoneLayoutedElements } from '../utils/zone-layout';
import { applyEdgeStyle } from '../utils/edge-styles';
import type { BreadcrumbItem, CloudNode, CloudEdge } from '../types';

export const MAX_HIERARCHY_DEPTH = 5;

// Resolve the parent chain from a node id back to root
function buildBreadcrumb(nodeId: string): BreadcrumbItem[] {
  if (nodeId === 'root') return [];

  const crumbs: BreadcrumbItem[] = [];
  const parts: string[] = [];

  let current: string | undefined = nodeId;
  while (current && current !== 'root') {
    parts.unshift(current);
    current = parentMap[current];
  }

  for (const partId of parts) {
    const level = graphRegistry[partId];
    if (level) {
      crumbs.push({ id: partId, label: level.label });
    }
  }

  return crumbs;
}

export type ViewMode = 'zone' | 'explorer';

/** Inject user midY overrides into edge data */
function applyEdgeOverrides(
  edges: Edge[],
  overrides: Map<string, number>
): Edge[] {
  if (overrides.size === 0) return edges;
  return edges.map((edge) => {
    const userMidY = overrides.get(edge.id);
    if (userMidY === undefined) return edge;
    return {
      ...edge,
      data: { ...edge.data, userMidY },
    };
  });
}

export function useGraphNavigation() {
  const [viewMode, setViewMode] = useState<ViewMode>('zone');
  const [currentLevel, setCurrentLevel] = useState('root');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoneDepth, setZoneDepth] = useState(MAX_HIERARCHY_DEPTH);
  const [collapsedZones, setCollapsedZones] = useState<Set<string>>(new Set());

  // User-dragged edge midY overrides, persisted across navigation
  const edgeOverridesRef = useRef(new Map<string, number>());
  // Use a counter to trigger re-render when overrides change
  const [overrideVersion, setOverrideVersion] = useState(0);

  const breadcrumb = useMemo(() => buildBreadcrumb(currentLevel), [currentLevel]);

  // Explorer mode: original drill-down layout
  const explorerData = useMemo(() => {
    if (viewMode !== 'explorer') return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    const level = graphRegistry[currentLevel];
    if (!level) return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    const layouted = getLayoutedElements(level.nodes, level.edges, 'TB') as {
      nodes: CloudNode[];
      edges: CloudEdge[];
    };
    return {
      nodes: layouted.nodes,
      edges: applyEdgeOverrides(
        layouted.edges.map(applyEdgeStyle),
        edgeOverridesRef.current
      ) as CloudEdge[],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, viewMode, overrideVersion]);

  // Zone mode: flattened graph with nested zones
  const zoneData = useMemo(() => {
    if (viewMode !== 'zone') return { nodes: [] as Node[], edges: [] as Edge[] };
    const { nodes: flatNodes, edges: flatEdges } = flattenGraph(zoneDepth, collapsedZones);
    const layouted = getZoneLayoutedElements(flatNodes, flatEdges);

    // Apply semantic edge colors, then overlay cross-zone dashed indicator
    const nodeParentMap = buildNodeParentMap(layouted.nodes);
    const styledEdges = layouted.edges.map((edge) => {
      const styled = applyEdgeStyle(edge);
      if (isCrossZoneEdge(edge, nodeParentMap)) {
        return {
          ...styled,
          style: {
            ...(styled.style as Record<string, unknown>),
            strokeWidth: 2,
            strokeDasharray: '6 3',
          },
          animated: true,
        };
      }
      return styled;
    });

    return {
      nodes: layouted.nodes,
      edges: applyEdgeOverrides(styledEdges, edgeOverridesRef.current),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, zoneDepth, collapsedZones, overrideVersion]);

  const nodes = viewMode === 'zone' ? zoneData.nodes : explorerData.nodes;
  const edges = viewMode === 'zone' ? zoneData.edges : explorerData.edges;

  const currentLevelData = graphRegistry[currentLevel];

  const navigateTo = useCallback((nodeId: string) => {
    if (graphRegistry[nodeId]) {
      setCurrentLevel(nodeId);
      setSelectedNodeId(null);
    }
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const toggleZoneCollapse = useCallback((zoneId: string) => {
    setCollapsedZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) {
        next.delete(zoneId);
      } else {
        next.add(zoneId);
      }
      return next;
    });
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'zone' ? 'explorer' : 'zone'));
    setSelectedNodeId(null);
  }, []);

  /** Set or clear a user-dragged midY override for an edge */
  const updateEdgeMidY = useCallback((edgeId: string, midY: number | null) => {
    if (midY === null) {
      edgeOverridesRef.current.delete(edgeId);
    } else {
      edgeOverridesRef.current.set(edgeId, midY);
    }
    setOverrideVersion((v) => v + 1);
  }, []);

  return {
    viewMode,
    currentLevel,
    currentLevelData,
    nodes,
    edges,
    breadcrumb,
    selectedNodeId,
    zoneDepth,
    collapsedZones,
    navigateTo,
    selectNode,
    toggleZoneCollapse,
    toggleViewMode,
    setZoneDepth,
    updateEdgeMidY,
  };
}
