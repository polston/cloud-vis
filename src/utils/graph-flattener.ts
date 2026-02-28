import { type Node, type Edge } from '@xyflow/react';
import { graphRegistry } from '../data/graph-data';
import type { CloudNodeData, ZoneNodeData } from '../types';

/**
 * The parent map mirrors the one in useGraphNavigation but is used here
 * to know which registry key is a child of which parent registry key.
 */
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

export { parentMap };

export interface FlattenedGraph {
  nodes: Node[];
  edges: Edge[];
  /** Maps zone node IDs to the registry keys they represent */
  zoneMap: Map<string, string>;
}

/**
 * Recursively flatten the graph registry into a single graph with zone containers.
 * Zone nodes use React Flow's parentId to create nested grouping.
 *
 * @param maxDepth - How many levels deep to expand (0 = just root nodes, 1 = root + first children, etc.)
 * @param collapsedZones - Set of zone IDs that the user has manually collapsed
 */
export function flattenGraph(
  maxDepth: number,
  collapsedZones: Set<string>
): FlattenedGraph {
  const allNodes: Node[] = [];
  const allEdges: Edge[] = [];
  const zoneMap = new Map<string, string>();

  // Track which node IDs have been promoted to zones so we can remap edges
  const promotedToZone = new Set<string>();

  function processLevel(
    registryKey: string,
    parentZoneId: string | undefined,
    currentDepth: number
  ) {
    const level = graphRegistry[registryKey];
    if (!level) return;

    for (const node of level.nodes) {
      const data = node.data as unknown as CloudNodeData;
      const hasRegistryEntry = !!graphRegistry[node.id];
      const shouldExpand =
        data.hasChildren &&
        hasRegistryEntry &&
        currentDepth < maxDepth &&
        !collapsedZones.has(node.id);

      if (shouldExpand) {
        // Create a zone container node for this group
        const zoneNode: Node<ZoneNodeData> = {
          id: node.id,
          type: 'zoneContainer',
          position: { x: 0, y: 0 },
          ...(parentZoneId ? { parentId: parentZoneId, expandParent: false } : {}),
          data: {
            label: data.label,
            description: data.description,
            provider: data.provider,
            category: data.category,
            icon: data.icon,
            color: data.color,
            zoneLevel: currentDepth,
            isCollapsed: false,
            childCount: graphRegistry[node.id]?.nodes.length ?? 0,
            registryKey: node.id,
          },
          style: { padding: 0 },
        };
        allNodes.push(zoneNode);
        zoneMap.set(node.id, node.id);
        promotedToZone.add(node.id);

        // Recurse into children
        processLevel(node.id, node.id, currentDepth + 1);
      } else {
        // Leaf node or collapsed zone — render as a regular service/group node
        const leafNode: Node = {
          id: node.id,
          type: data.hasChildren && hasRegistryEntry ? 'cloudGroup' : 'cloudService',
          position: { x: 0, y: 0 },
          ...(parentZoneId ? { parentId: parentZoneId, expandParent: false } : {}),
          data: {
            ...data,
            // If it's a collapsed zone, mark it so double-click can re-expand
            isCollapsed: collapsedZones.has(node.id),
            sourceHandles: [],
            targetHandles: [],
          },
        };
        allNodes.push(leafNode);
      }
    }

    // Add edges from this level, but skip edges where both source and target
    // were promoted to zones (those connections are implicit via containment)
    for (const edge of level.edges) {
      const edgeId = `${registryKey}::${edge.id}`;
      allEdges.push({
        ...edge,
        id: edgeId,
        type: 'smoothstep',
        style: { stroke: '#475569', strokeWidth: 1.5 },
      });
    }
  }

  // Start from root
  processLevel('root', undefined, 0);

  return { nodes: allNodes, edges: allEdges, zoneMap };
}

/**
 * Detect whether an edge crosses a zone boundary (source and target have different parent zones).
 */
export function isCrossZoneEdge(
  edge: Edge,
  nodeParentMap: Map<string, string | undefined>
): boolean {
  const sourceParent = nodeParentMap.get(edge.source);
  const targetParent = nodeParentMap.get(edge.target);
  return sourceParent !== targetParent;
}

/**
 * Build a map from node ID to its immediate parent zone ID.
 */
export function buildNodeParentMap(nodes: Node[]): Map<string, string | undefined> {
  const map = new Map<string, string | undefined>();
  for (const node of nodes) {
    map.set(node.id, (node as Node & { parentId?: string }).parentId);
  }
  return map;
}
