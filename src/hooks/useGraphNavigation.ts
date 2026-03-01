import { useState, useCallback, useMemo, useRef } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { graphRegistry } from '../data/graph-data';
import { getLayoutedElements } from '../utils/layout';
import { flattenGraph, buildNodeParentMap, isCrossZoneEdge, parentMap, fullParentMap } from '../utils/graph-flattener';
import { getZoneLayoutedElements } from '../utils/zone-layout';
import { applyEdgeStyle } from '../utils/edge-styles';
import type { BreadcrumbItem, CloudNode, CloudEdge } from '../types';

/**
 * BFS in both directions from the selected node to find all edges
 * in paths leading to and from it (transitive highlighting).
 */
function getTransitiveEdgeIds(nodeId: string, edges: Edge[]): Set<string> {
  const result = new Set<string>();

  const bySource = new Map<string, Edge[]>();
  const byTarget = new Map<string, Edge[]>();
  for (const e of edges) {
    if (!bySource.has(e.source)) bySource.set(e.source, []);
    bySource.get(e.source)!.push(e);
    if (!byTarget.has(e.target)) byTarget.set(e.target, []);
    byTarget.get(e.target)!.push(e);
  }

  // Forward: follow outgoing edges
  const fwdVisited = new Set<string>([nodeId]);
  const fwdQueue = [nodeId];
  while (fwdQueue.length > 0) {
    const n = fwdQueue.shift()!;
    for (const e of bySource.get(n) ?? []) {
      result.add(e.id);
      if (!fwdVisited.has(e.target)) {
        fwdVisited.add(e.target);
        fwdQueue.push(e.target);
      }
    }
  }

  // Backward: follow incoming edges
  const bwdVisited = new Set<string>([nodeId]);
  const bwdQueue = [nodeId];
  while (bwdQueue.length > 0) {
    const n = bwdQueue.shift()!;
    for (const e of byTarget.get(n) ?? []) {
      result.add(e.id);
      if (!bwdVisited.has(e.source)) {
        bwdVisited.add(e.source);
        bwdQueue.push(e.source);
      }
    }
  }

  return result;
}

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

export function useGraphNavigation() {
  const [viewMode, setViewMode] = useState<ViewMode>('zone');
  const [currentLevel, setCurrentLevel] = useState('root');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoneDepth, setZoneDepth] = useState(MAX_HIERARCHY_DEPTH);
  const [collapsedZones, setCollapsedZones] = useState<Set<string>>(new Set());

  // Lock states: zones locked by default, leaf nodes unlocked by default
  const [zonesLocked, setZonesLocked] = useState(true);
  const [nodesLocked, setNodesLocked] = useState(false);

  // User-dragged node position overrides, persisted across layout changes
  const nodePositionOverridesRef = useRef(new Map<string, { x: number; y: number }>());
  const [positionResetVersion, setPositionResetVersion] = useState(0);

  const breadcrumb = useMemo(() => buildBreadcrumb(currentLevel), [currentLevel]);

  // Explorer mode: original drill-down layout (nodes + base edges, no selection styling)
  const explorerLayout = useMemo(() => {
    if (viewMode !== 'explorer') return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    const level = graphRegistry[currentLevel];
    if (!level) return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    const layouted = getLayoutedElements(level.nodes, level.edges, 'TB') as {
      nodes: CloudNode[];
      edges: CloudEdge[];
    };
    return {
      nodes: layouted.nodes,
      edges: layouted.edges.map(applyEdgeStyle) as CloudEdge[],
    };
  }, [currentLevel, viewMode]);

  // Apply selection-dependent edge highlighting separately so node refs stay stable
  const explorerEdges = useMemo(() => {
    if (!selectedNodeId) {
      return explorerLayout.edges;
    }
    const highlighted = getTransitiveEdgeIds(selectedNodeId, explorerLayout.edges);
    return explorerLayout.edges.map((edge) => ({
      ...edge,
      className: highlighted.has(edge.id) ? 'edge-highlighted' : 'edge-dimmed',
    })) as CloudEdge[];
  }, [explorerLayout.edges, selectedNodeId]);

  // Zone mode: flattened graph with nested zones (layout + base edges, no selection styling)
  const zoneLayout = useMemo(() => {
    if (viewMode !== 'zone') return { nodes: [] as Node[], edges: [] as Edge[] };
    const { nodes: flatNodes, edges: flatEdges } = flattenGraph(zoneDepth, collapsedZones);
    const layouted = getZoneLayoutedElements(flatNodes, flatEdges);

    // Apply lock states, z-index layering, and position overrides to nodes.
    // Deeper zones get higher zIndex so inner categories take drag priority
    // over their parents. Leaf nodes sit above all zones.
    const nodesWithLocks = layouted.nodes.map((node) => {
      const isZone = node.type === 'zoneContainer';
      const draggable = isZone ? !zonesLocked : !nodesLocked;
      const posOverride = nodePositionOverridesRef.current.get(node.id);
      const zoneLevel = isZone ? ((node.data as Record<string, unknown>).zoneLevel as number) ?? 0 : 0;
      const zIndex = isZone ? 1 + zoneLevel : MAX_HIERARCHY_DEPTH + 1;
      return {
        ...node,
        draggable,
        zIndex,
        ...(posOverride ? { position: posOverride } : {}),
      };
    });

    // Apply semantic edge colors, then overlay cross-zone dashed indicator
    const nodeParentMap = buildNodeParentMap(nodesWithLocks);
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
      nodes: nodesWithLocks,
      edges: styledEdges,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, zoneDepth, collapsedZones, zonesLocked, nodesLocked, positionResetVersion]);

  // Apply selection-dependent edge highlighting separately so node refs stay stable.
  // Only highlight edges when a leaf node (not a zone container) is selected.
  const zoneEdges = useMemo(() => {
    if (!selectedNodeId) {
      return zoneLayout.edges;
    }
    // Don't highlight edges when a zone container is selected
    const isZoneSelected = zoneLayout.nodes.some(
      (n) => n.id === selectedNodeId && n.type === 'zoneContainer'
    );
    if (isZoneSelected) {
      return zoneLayout.edges;
    }
    const highlighted = getTransitiveEdgeIds(selectedNodeId, zoneLayout.edges);
    return zoneLayout.edges.map((edge) => ({
      ...edge,
      className: highlighted.has(edge.id) ? 'edge-highlighted' : 'edge-dimmed',
    }));
  }, [zoneLayout.edges, zoneLayout.nodes, selectedNodeId]);

  const nodes = viewMode === 'zone' ? zoneLayout.nodes : explorerLayout.nodes;
  const edges = viewMode === 'zone' ? zoneEdges : explorerEdges;

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

  const toggleZonesLocked = useCallback(() => {
    setZonesLocked((prev) => !prev);
  }, []);

  const toggleNodesLocked = useCallback(() => {
    setNodesLocked((prev) => !prev);
  }, []);

  /** Store a node's dragged position so it persists across layout recalculations */
  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    nodePositionOverridesRef.current.set(nodeId, position);
  }, []);

  /** Clear all node position overrides, returning to auto-layout */
  const resetPositions = useCallback(() => {
    nodePositionOverridesRef.current.clear();
    setPositionResetVersion((v) => v + 1);
  }, []);

  const hasPositionOverrides = nodePositionOverridesRef.current.size > 0;

  /** Navigate to a node from search — handles both explorer and zone modes. */
  const navigateToNode = useCallback(
    (nodeId: string, nodeParentKey: string) => {
      if (viewMode === 'explorer') {
        // Navigate to the level containing this node, then select it
        setCurrentLevel(nodeParentKey);
        setSelectedNodeId(null);
        // Select after layout settles
        setTimeout(() => setSelectedNodeId(nodeId), 60);
      } else {
        // Zone mode: uncollapse all ancestors so the node becomes visible
        setCollapsedZones((prev) => {
          const next = new Set(prev);
          // Walk up the parent chain and remove any collapsed ancestors
          let current: string | undefined = nodeParentKey;
          while (current && current !== 'root') {
            next.delete(current);
            current = fullParentMap[current];
          }
          return next;
        });
        setSelectedNodeId(nodeId);
      }
      return nodeId;
    },
    [viewMode]
  );

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
    zonesLocked,
    nodesLocked,
    hasPositionOverrides,
    navigateTo,
    selectNode,
    toggleZoneCollapse,
    toggleViewMode,
    setZoneDepth,
    toggleZonesLocked,
    toggleNodesLocked,
    updateNodePosition,
    resetPositions,
    navigateToNode,
  };
}
