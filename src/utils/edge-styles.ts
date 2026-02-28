import { MarkerType, type Edge } from '@xyflow/react';

// ─── Edge categories ────────────────────────────────────────────────
export type EdgeCategory =
  | 'data-flow'
  | 'control'
  | 'monitoring'
  | 'security'
  | 'structural';

export const edgeCategoryColors: Record<EdgeCategory, string> = {
  'data-flow': '#06B6D4',
  control: '#A78BFA',
  monitoring: '#EAB308',
  security: '#F43F5E',
  structural: '#64748B',
};

export const edgeCategoryLabels: Record<EdgeCategory, string> = {
  'data-flow': 'Data flow',
  control: 'Control',
  monitoring: 'Monitoring',
  security: 'Security',
  structural: 'Structural',
};

// ─── Label → category mapping ───────────────────────────────────────
const labelCategoryMap: Record<string, EdgeCategory> = {
  // Data flow — edges that carry data, traffic, or events
  'DNS': 'data-flow',
  'Traffic': 'data-flow',
  'Read/Write': 'data-flow',
  'Read/Write state': 'data-flow',
  'Query': 'data-flow',
  'Fanout': 'data-flow',
  'Streams to': 'data-flow',
  'Poll': 'data-flow',
  'Subscribe': 'data-flow',
  'Retrieves from': 'data-flow',
  'Delivers to': 'data-flow',
  'Replicates to': 'data-flow',
  'Pools connections': 'data-flow',
  'Failed events': 'data-flow',
  'Failed deliveries': 'data-flow',
  'Redirects failed': 'data-flow',
  'Replicates': 'data-flow',
  'Public traffic': 'data-flow',
  'Private outbound': 'data-flow',
  'Continuous backup': 'data-flow',
  'Backs up': 'data-flow',
  'Trigger': 'data-flow',
  'Triggers': 'data-flow',
  'Invokes': 'data-flow',
  'Routes to': 'data-flow',
  'Routes through': 'data-flow',

  // Control — management, orchestration, configuration
  'Manages': 'control',
  'Runs on': 'control',
  'Runs': 'control',
  'Run before': 'control',
  'Configures': 'control',
  'Defines': 'control',
  'Controls': 'control',
  'Constrains': 'control',
  'Launches': 'control',
  'Caps & reserves': 'control',
  'Pre-warms': 'control',
  'Places': 'control',
  'Evaluates': 'control',
  'Snapshot of': 'control',
  'Combined into': 'control',
  'Filters to': 'control',
  'Watch pods': 'control',
  'Watch & update': 'control',
  'Watch': 'control',
  'Failover': 'control',
  'Applied to': 'control',
  'Transitions to': 'control',

  // Monitoring — observability, alerting, reporting
  'Monitors': 'monitoring',
  'Checks': 'monitoring',
  'Analyzes': 'monitoring',
  'Analyzed by': 'monitoring',
  'Tracks': 'monitoring',
  'Reports': 'monitoring',
  'Displayed on': 'monitoring',
  'Alerts via': 'monitoring',
  'Publishes': 'monitoring',
  'Queried by': 'monitoring',
  'Auto-adjusts': 'monitoring',

  // Security — authentication, authorization, encryption
  'Auth': 'security',
  'Protects': 'security',
  'Filters': 'security',
  'Limits': 'security',
  'Credentials': 'security',
  'Intercept requests': 'security',
  'Identity': 'security',
  'Validates': 'security',
  'SSH access': 'security',
  'Issues tokens': 'security',
  'Session tokens': 'security',
  'Federate into': 'security',
  'Encrypts': 'security',

  // Structural — containment, association, attachment
  'Inside': 'structural',
  'Contains': 'structural',
  'Attached to': 'structural',
  'Included in': 'structural',
  'Associated with': 'structural',
  'Belong to': 'structural',
  'Has': 'structural',
  'Assigned to': 'structural',
  'Network': 'structural',
  'Routes': 'structural',
  'Connects': 'structural',
  'Provides IPs': 'structural',
  'Private access': 'structural',
  'Mount': 'structural',
  'Mount/Env': 'structural',
  'Local to': 'structural',
  'Via routes': 'structural',
  'Attached in': 'structural',
  'Requires': 'structural',
  'Private Endpoint': 'structural',
  'VNet Integration': 'structural',
  'VPC Connector': 'structural',
  'Provides': 'structural',
  'Resolves via': 'structural',
  'Resolves': 'structural',
  'Stores': 'structural',
};

export function classifyEdge(label?: string): EdgeCategory {
  if (!label) return 'structural';
  return labelCategoryMap[label] ?? 'structural';
}

export function getEdgeColor(label?: string): string {
  return edgeCategoryColors[classifyEdge(label)];
}

/**
 * Apply semantic color and directional arrowhead to an edge.
 * All edges get an arrowhead at the target end; structural edges
 * use a subtler open arrow while others use a filled arrow.
 */
export function applyEdgeStyle(edge: Edge): Edge {
  const label = typeof edge.label === 'string' ? edge.label : undefined;
  const color = getEdgeColor(label);

  return {
    ...edge,
    style: {
      stroke: color,
      strokeWidth: 1.5,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
      width: 16,
      height: 16,
    },
  };
}
