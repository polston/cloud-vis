import { type Node, type Edge } from '@xyflow/react';

export type CloudProvider = 'aws' | 'gcp' | 'azure';

export interface ServiceCategory {
  id: string;
  label: string;
  provider: CloudProvider;
  color: string;
  icon: string;
}

export interface CloudService {
  id: string;
  label: string;
  description: string;
  provider: CloudProvider;
  category: string;
  icon: string;
  children?: string[];
  parentId?: string;
}

export type GatewayType = 'ingress' | 'egress' | 'both';

export interface CloudNodeData {
  label: string;
  description: string;
  provider: CloudProvider;
  category: string;
  icon: string;
  isGroup: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  depth: number;
  color: string;
  gatewayType?: GatewayType;
  [key: string]: unknown;
}

export interface ZoneNodeData {
  label: string;
  description: string;
  provider: CloudProvider;
  category: string;
  icon: string;
  color: string;
  zoneLevel: number;
  isCollapsed: boolean;
  childCount: number;
  registryKey: string;
  [key: string]: unknown;
}

export type CloudNode = Node<CloudNodeData>;
export type CloudEdge = Edge;
export type ZoneNode = Node<ZoneNodeData>;

export interface GraphLevel {
  id: string;
  label: string;
  description: string;
  parentId?: string;
  nodes: CloudNode[];
  edges: CloudEdge[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
}
