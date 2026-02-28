import { useState, useCallback, useMemo } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { graphRegistry } from '../data/graph-data';
import { getLayoutedElements } from '../utils/layout';
import { flattenGraph, buildNodeParentMap, isCrossZoneEdge } from '../utils/graph-flattener';
import { getZoneLayoutedElements } from '../utils/zone-layout';
import type { BreadcrumbItem, CloudNode, CloudEdge } from '../types';

export const MAX_HIERARCHY_DEPTH = 5;

// Resolve the parent chain from a node id back to root
function buildBreadcrumb(nodeId: string): BreadcrumbItem[] {
  if (nodeId === 'root') return [];

  const crumbs: BreadcrumbItem[] = [];
  const parts: string[] = [];

  const parentMap: Record<string, string> = {
    // AWS
    'aws-vpc': 'aws', 'aws-iam': 'aws', 'aws-eks': 'aws', 'aws-ec2': 'aws',
    'aws-s3': 'aws', 'aws-rds': 'aws', 'aws-lambda': 'aws', 'aws-cloudwatch': 'aws',
    'aws-route53': 'aws', 'aws-elb': 'aws', 'aws-sqs': 'aws', 'aws-sns': 'aws',
    // EKS
    'eks-control-plane': 'aws-eks', 'eks-worker-nodes': 'aws-eks', 'eks-networking': 'aws-eks',
    'wn-pods': 'eks-worker-nodes',
    // GCP
    'gcp-vpc': 'gcp', 'gcp-iam': 'gcp', 'gcp-gke': 'gcp', 'gcp-gce': 'gcp',
    'gcp-gcs': 'gcp', 'gcp-cloudsql': 'gcp', 'gcp-functions': 'gcp', 'gcp-monitoring': 'gcp',
    'gke-control-plane': 'gcp-gke', 'gke-node-pools': 'gcp-gke', 'gke-networking': 'gcp-gke',
    // Azure
    'az-vnet': 'azure', 'az-ad': 'azure', 'az-aks': 'azure', 'az-vm': 'azure',
    'az-blob': 'azure', 'az-sql': 'azure', 'az-functions': 'azure', 'az-monitor': 'azure',
    'aks-control-plane': 'az-aks', 'aks-node-pools': 'az-aks', 'aks-networking': 'az-aks',
  };

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

  const breadcrumb = useMemo(() => buildBreadcrumb(currentLevel), [currentLevel]);

  // Explorer mode: original drill-down layout
  const explorerData = useMemo(() => {
    if (viewMode !== 'explorer') return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    const level = graphRegistry[currentLevel];
    if (!level) return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    return getLayoutedElements(level.nodes, level.edges, 'TB') as {
      nodes: CloudNode[];
      edges: CloudEdge[];
    };
  }, [currentLevel, viewMode]);

  // Zone mode: flattened graph with nested zones
  const zoneData = useMemo(() => {
    if (viewMode !== 'zone') return { nodes: [] as Node[], edges: [] as Edge[] };
    const { nodes: flatNodes, edges: flatEdges } = flattenGraph(zoneDepth, collapsedZones);
    const layouted = getZoneLayoutedElements(flatNodes, flatEdges);

    // Style cross-zone edges
    const nodeParentMap = buildNodeParentMap(layouted.nodes);
    const styledEdges = layouted.edges.map((edge) => {
      if (isCrossZoneEdge(edge, nodeParentMap)) {
        return {
          ...edge,
          style: { stroke: '#F59E0B', strokeWidth: 2, strokeDasharray: '6 3' },
          className: 'cross-zone-edge',
          animated: true,
        };
      }
      return edge;
    });

    return { nodes: layouted.nodes, edges: styledEdges };
  }, [viewMode, zoneDepth, collapsedZones]);

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
  };
}
