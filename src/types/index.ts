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
  [key: string]: unknown;
}

export type CloudNode = Node<CloudNodeData>;
export type CloudEdge = Edge;

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
