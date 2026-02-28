import { useState, useCallback, useMemo } from 'react';
import { graphRegistry } from '../data/graph-data';
import { getLayoutedElements } from '../utils/layout';
import type { BreadcrumbItem, CloudNode, CloudEdge } from '../types';

// Resolve the parent chain from a node id back to root
function buildBreadcrumb(nodeId: string): BreadcrumbItem[] {
  if (nodeId === 'root') return [];

  const crumbs: BreadcrumbItem[] = [];
  const parts: string[] = [];

  // For ids like 'eks-control-plane', we walk up the known registry
  // We maintain a simple parent map based on containment
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

export function useGraphNavigation() {
  const [currentLevel, setCurrentLevel] = useState('root');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const breadcrumb = useMemo(() => buildBreadcrumb(currentLevel), [currentLevel]);

  const { nodes, edges } = useMemo(() => {
    const level = graphRegistry[currentLevel];
    if (!level) return { nodes: [] as CloudNode[], edges: [] as CloudEdge[] };
    return getLayoutedElements(level.nodes, level.edges, 'TB') as {
      nodes: CloudNode[];
      edges: CloudEdge[];
    };
  }, [currentLevel]);

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

  return {
    currentLevel,
    currentLevelData,
    nodes,
    edges,
    breadcrumb,
    selectedNodeId,
    navigateTo,
    selectNode,
  };
}
