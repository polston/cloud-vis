import type { CloudNode, CloudEdge } from '../types';
import { categoryColors } from './providers';

// ─── Helper to build nodes ────────────────────────────────────────────
function n(
  id: string,
  label: string,
  description: string,
  provider: 'aws' | 'gcp' | 'azure',
  category: string,
  icon: string,
  opts: { isGroup?: boolean; hasChildren?: boolean } = {}
): CloudNode {
  return {
    id,
    type: opts.isGroup ? 'cloudGroup' : 'cloudService',
    position: { x: 0, y: 0 },
    data: {
      label,
      description,
      provider,
      category,
      icon,
      isGroup: opts.isGroup ?? false,
      isExpanded: false,
      hasChildren: opts.hasChildren ?? false,
      depth: 0,
      color: categoryColors[category] ?? '#6B7280',
    },
  };
}

function e(source: string, target: string, label?: string): CloudEdge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    label,
    type: 'smartEdge',
    animated: false,
    style: { stroke: '#475569', strokeWidth: 1.5 },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// TOP LEVEL — Provider overview
// ═══════════════════════════════════════════════════════════════════════
export const topLevelNodes: CloudNode[] = [
  n('aws', 'Amazon Web Services', 'AWS Cloud Platform', 'aws', 'compute', 'Cloud', { isGroup: true, hasChildren: true }),
  n('gcp', 'Google Cloud Platform', 'GCP Cloud Platform', 'gcp', 'compute', 'Cloud', { isGroup: true, hasChildren: true }),
  n('azure', 'Microsoft Azure', 'Azure Cloud Platform', 'azure', 'compute', 'Cloud', { isGroup: true, hasChildren: true }),
];

export const topLevelEdges: CloudEdge[] = [];

// ═══════════════════════════════════════════════════════════════════════
// AWS — Service categories
// ═══════════════════════════════════════════════════════════════════════
export const awsNodes: CloudNode[] = [
  n('aws-vpc', 'VPC', 'Virtual Private Cloud – isolated network', 'aws', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('aws-iam', 'IAM', 'Identity & Access Management – who can do what', 'aws', 'security', 'Shield', { isGroup: true, hasChildren: true }),
  n('aws-eks', 'EKS', 'Elastic Kubernetes Service', 'aws', 'kubernetes', 'Box', { isGroup: true, hasChildren: true }),
  n('aws-ec2', 'EC2', 'Elastic Compute Cloud', 'aws', 'compute', 'Server', { isGroup: true, hasChildren: true }),
  n('aws-s3', 'S3', 'Simple Storage Service', 'aws', 'storage', 'HardDrive', { isGroup: true, hasChildren: true }),
  n('aws-rds', 'RDS', 'Relational Database Service', 'aws', 'database', 'Database', { isGroup: true, hasChildren: true }),
  n('aws-lambda', 'Lambda', 'Serverless Functions', 'aws', 'serverless', 'Zap', { isGroup: true, hasChildren: true }),
  n('aws-cloudwatch', 'CloudWatch', 'Monitoring & Observability', 'aws', 'monitoring', 'Activity', { isGroup: true, hasChildren: true }),
  n('aws-route53', 'Route 53', 'DNS, domain registration & health checks', 'aws', 'networking', 'Globe', { isGroup: true, hasChildren: true }),
  n('aws-elb', 'ELB', 'Elastic Load Balancing – distributes traffic', 'aws', 'networking', 'GitBranch', { isGroup: true, hasChildren: true }),
  n('aws-sqs', 'SQS', 'Fully managed message queuing', 'aws', 'messaging', 'Inbox', { isGroup: true, hasChildren: true }),
  n('aws-sns', 'SNS', 'Managed pub/sub messaging', 'aws', 'messaging', 'Bell', { isGroup: true, hasChildren: true }),
  n('aws-eventbridge', 'EventBridge', 'Serverless event bus', 'aws', 'messaging', 'Zap'),
];

export const awsEdges: CloudEdge[] = [
  e('aws-route53', 'aws-elb', 'DNS'),
  e('aws-elb', 'aws-eks', 'Traffic'),
  e('aws-elb', 'aws-ec2', 'Traffic'),
  e('aws-elb', 'aws-lambda', 'Traffic'),
  e('aws-eks', 'aws-ec2', 'Runs on'),
  e('aws-ec2', 'aws-vpc', 'Inside'),
  e('aws-eks', 'aws-vpc', 'Inside'),
  e('aws-eks', 'aws-iam', 'Auth'),
  e('aws-ec2', 'aws-s3', 'Read/Write'),
  e('aws-ec2', 'aws-rds', 'Query'),
  e('aws-lambda', 'aws-s3', 'Trigger'),
  e('aws-lambda', 'aws-sqs', 'Poll'),
  e('aws-sns', 'aws-sqs', 'Fanout'),
  e('aws-sns', 'aws-lambda', 'Triggers'),
  e('aws-lambda', 'aws-rds', 'Query'),
  e('aws-cloudwatch', 'aws-ec2', 'Monitors'),
  e('aws-cloudwatch', 'aws-eks', 'Monitors'),
  e('aws-cloudwatch', 'aws-lambda', 'Monitors'),
  e('aws-cloudwatch', 'aws-rds', 'Monitors'),
  e('aws-cloudwatch', 'aws-elb', 'Monitors'),
  e('aws-cloudwatch', 'aws-sns', 'Alerts via'),
  e('aws-lambda', 'aws-vpc', 'Inside'),
  e('aws-eventbridge', 'aws-lambda', 'Triggers'),
  e('aws-eventbridge', 'aws-sqs', 'Routes to'),
  e('aws-eventbridge', 'aws-sns', 'Routes to'),
];

// ═══════════════════════════════════════════════════════════════════════
// AWS EKS — Kubernetes internals
// ═══════════════════════════════════════════════════════════════════════
export const eksNodes: CloudNode[] = [
  n('eks-control-plane', 'Control Plane', 'Managed by AWS', 'aws', 'control-plane', 'Cpu', { isGroup: true, hasChildren: true }),
  n('eks-worker-nodes', 'Worker Nodes', 'Compute resources running pods', 'aws', 'worker-node', 'Server', { isGroup: true, hasChildren: true }),
  n('eks-networking', 'Cluster Networking', 'VPC CNI, CoreDNS & kube-proxy', 'aws', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('eks-fargate', 'Fargate Profiles', 'Serverless pods – no EC2 management', 'aws', 'serverless', 'Cloud'),
  n('eks-addons', 'EKS Add-ons', 'Managed operational software (CNI, DNS, proxy)', 'aws', 'kubernetes', 'Layers'),
  n('eks-pod-identity', 'Pod Identity', 'Pod-level IAM credentials via OIDC', 'aws', 'security', 'Key'),
];

export const eksEdges: CloudEdge[] = [
  e('eks-control-plane', 'eks-worker-nodes', 'Manages'),
  e('eks-control-plane', 'eks-fargate', 'Manages'),
  e('eks-networking', 'eks-worker-nodes', 'Connects'),
  e('eks-networking', 'eks-control-plane', 'Connects'),
  e('eks-networking', 'eks-fargate', 'Connects'),
  e('eks-addons', 'eks-networking', 'Provides'),
  e('eks-pod-identity', 'eks-worker-nodes', 'Credentials'),
  e('eks-pod-identity', 'eks-fargate', 'Credentials'),
];

// ─── EKS Control Plane ────────────────────────────────────────────────
export const eksControlPlaneNodes: CloudNode[] = [
  n('cp-api-server', 'API Server', 'kube-apiserver – REST API front-end for the control plane', 'aws', 'control-plane', 'Globe'),
  n('cp-etcd', 'etcd', 'Distributed key-value store for cluster state', 'aws', 'control-plane', 'Database'),
  n('cp-scheduler', 'Scheduler', 'kube-scheduler – assigns pods to nodes', 'aws', 'control-plane', 'Calendar'),
  n('cp-controller-manager', 'Controller Manager', 'kube-controller-manager – runs controllers', 'aws', 'control-plane', 'Settings'),
  n('cp-cloud-controller', 'Cloud Controller Manager', 'Manages AWS-specific resources (ELB, EBS)', 'aws', 'control-plane', 'Cloud'),
  n('cp-admission', 'Admission Controllers', 'Validates & mutates API requests', 'aws', 'control-plane', 'ShieldCheck'),
];

export const eksControlPlaneEdges: CloudEdge[] = [
  e('cp-api-server', 'cp-etcd', 'Read/Write state'),
  e('cp-scheduler', 'cp-api-server', 'Watch pods'),
  e('cp-controller-manager', 'cp-api-server', 'Watch & update'),
  e('cp-cloud-controller', 'cp-api-server', 'Watch & update'),
  e('cp-admission', 'cp-api-server', 'Intercept requests'),
];

// ─── EKS Worker Nodes ─────────────────────────────────────────────────
export const eksWorkerNodes: CloudNode[] = [
  n('wn-kubelet', 'Kubelet', 'Node agent – manages pod lifecycle', 'aws', 'worker-node', 'Cpu'),
  n('wn-kube-proxy', 'kube-proxy', 'Network proxy – maintains network rules', 'aws', 'worker-node', 'Network'),
  n('wn-container-runtime', 'Container Runtime', 'containerd – runs containers', 'aws', 'worker-node', 'Box'),
  n('wn-pods', 'Pods', 'Smallest deployable units', 'aws', 'worker-node', 'Layers', { isGroup: true, hasChildren: true }),
  n('wn-daemonsets', 'DaemonSets', 'One pod per node (monitoring, logging)', 'aws', 'worker-node', 'Copy'),
  n('wn-node-resources', 'Node Resources', 'CPU, Memory, Storage, GPU', 'aws', 'worker-node', 'BarChart3'),
];

export const eksWorkerEdges: CloudEdge[] = [
  e('wn-kubelet', 'wn-container-runtime', 'Manages'),
  e('wn-container-runtime', 'wn-pods', 'Runs'),
  e('wn-container-runtime', 'wn-daemonsets', 'Runs'),
  e('wn-kube-proxy', 'wn-pods', 'Routes to'),
  e('wn-kubelet', 'wn-node-resources', 'Reports'),
];

// ─── EKS Networking ───────────────────────────────────────────────────
export const eksNetworkingNodes: CloudNode[] = [
  n('net-vpc-cni', 'VPC CNI Plugin', 'Assigns VPC IPs to pods', 'aws', 'networking', 'Network'),
  n('net-coredns', 'CoreDNS', 'Cluster DNS for service discovery', 'aws', 'networking', 'Globe'),
  n('net-ingress', 'AWS LB Controller', 'Routes external traffic via ALB/NLB', 'aws', 'networking', 'ArrowDownToLine'),
  n('net-services', 'Services', 'ClusterIP, NodePort, LoadBalancer', 'aws', 'networking', 'GitBranch'),
  n('net-network-policy', 'Network Policies', 'Pod-to-pod traffic rules', 'aws', 'security', 'Shield'),
];

export const eksNetworkingEdges: CloudEdge[] = [
  e('net-ingress', 'net-services', 'Routes to'),
  e('net-services', 'net-coredns', 'Resolves via'),
  e('net-vpc-cni', 'net-services', 'Provides IPs'),
  e('net-network-policy', 'net-services', 'Filters'),
];

// ─── Pod internals ────────────────────────────────────────────────────
export const podNodes: CloudNode[] = [
  n('pod-containers', 'Containers', 'Application containers', 'aws', 'containers', 'Box'),
  n('pod-init-containers', 'Init Containers', 'Run before app containers', 'aws', 'containers', 'PlayCircle'),
  n('pod-volumes', 'Volumes', 'Shared storage within pod', 'aws', 'storage', 'HardDrive'),
  n('pod-secrets', 'Secrets', 'Sensitive data (mounted or env)', 'aws', 'security', 'Lock'),
  n('pod-configmaps', 'ConfigMaps', 'Configuration data', 'aws', 'storage', 'FileText'),
  n('pod-service-account', 'Service Account', 'Pod identity for RBAC', 'aws', 'security', 'User'),
  n('pod-probes', 'Health Probes', 'Liveness, Readiness, Startup', 'aws', 'monitoring', 'HeartPulse'),
  n('pod-resources', 'Resource Limits', 'CPU & memory requests/limits', 'aws', 'compute', 'Gauge'),
];

export const podEdges: CloudEdge[] = [
  e('pod-init-containers', 'pod-containers', 'Run before'),
  e('pod-containers', 'pod-volumes', 'Mount'),
  e('pod-containers', 'pod-secrets', 'Mount/Env'),
  e('pod-containers', 'pod-configmaps', 'Mount/Env'),
  e('pod-containers', 'pod-service-account', 'Identity'),
  e('pod-probes', 'pod-containers', 'Checks'),
  e('pod-resources', 'pod-containers', 'Constrains'),
];

// ═══════════════════════════════════════════════════════════════════════
// AWS sub-service details
// ═══════════════════════════════════════════════════════════════════════
export const vpcNodes: CloudNode[] = [
  n('vpc-subnets', 'Subnets', 'Public & private IP ranges in single AZs', 'aws', 'networking', 'Layers'),
  n('vpc-igw', 'Internet Gateway', 'Bidirectional VPC-to-internet access', 'aws', 'networking', 'Globe'),
  n('vpc-nat', 'NAT Gateway', 'Outbound internet for private subnets', 'aws', 'networking', 'ArrowUpRight'),
  n('vpc-sg', 'Security Groups', 'Stateful ENI-level firewall (allow only)', 'aws', 'security', 'Shield'),
  n('vpc-nacl', 'NACLs', 'Stateless subnet-level firewall (allow & deny)', 'aws', 'security', 'ShieldCheck'),
  n('vpc-rt', 'Route Tables', 'Routing rules for subnets & gateways', 'aws', 'networking', 'GitBranch'),
  n('vpc-endpoints', 'VPC Endpoints', 'Private access to AWS services (Gateway & Interface)', 'aws', 'networking', 'Link'),
  n('vpc-peering', 'VPC Peering', 'Non-transitive VPC-to-VPC connectivity', 'aws', 'networking', 'Link'),
  n('vpc-flow-logs', 'Flow Logs', 'IP traffic logging for VPC/subnet/ENI', 'aws', 'monitoring', 'FileText'),
  n('vpc-tgw', 'Transit Gateway', 'Hub for multi-VPC & hybrid connectivity', 'aws', 'networking', 'GitBranch'),
  n('vpc-eip', 'Elastic IPs', 'Static public IPv4 addresses', 'aws', 'networking', 'MapPin'),
  n('vpc-eni', 'ENIs', 'Virtual network interface cards', 'aws', 'networking', 'Network'),
];

export const vpcEdges: CloudEdge[] = [
  e('vpc-igw', 'vpc-subnets', 'Public traffic'),
  e('vpc-nat', 'vpc-igw', 'Routes through'),
  e('vpc-nat', 'vpc-subnets', 'Private outbound'),
  e('vpc-rt', 'vpc-subnets', 'Routes'),
  e('vpc-sg', 'vpc-eni', 'Attached to'),
  e('vpc-eni', 'vpc-subnets', 'Attached in'),
  e('vpc-nacl', 'vpc-subnets', 'Filters'),
  e('vpc-endpoints', 'vpc-subnets', 'Private access'),
  e('vpc-peering', 'vpc-rt', 'Via routes'),
  e('vpc-flow-logs', 'vpc-subnets', 'Monitors'),
  e('vpc-tgw', 'vpc-subnets', 'Connects'),
  e('vpc-eip', 'vpc-nat', 'Assigned to'),
  e('vpc-eip', 'vpc-eni', 'Associated with'),
];

export const iamNodes: CloudNode[] = [
  n('iam-users', 'Users', 'Long-term identities for people or apps', 'aws', 'security', 'User'),
  n('iam-roles', 'Roles', 'Assumable identities with temporary credentials', 'aws', 'security', 'UserCheck'),
  n('iam-policies', 'Policies', 'JSON permission documents (identity, resource, boundary)', 'aws', 'security', 'FileText'),
  n('iam-groups', 'Groups', 'Collections of users for shared permissions', 'aws', 'security', 'Users'),
  n('iam-mfa', 'MFA', 'Multi-factor authentication devices', 'aws', 'security', 'ShieldCheck'),
  n('iam-sts', 'STS', 'Security Token Service – temporary credentials', 'aws', 'security', 'Key'),
  n('iam-idp', 'Identity Providers', 'SAML/OIDC federation sources', 'aws', 'security', 'Globe'),
  n('iam-instance-profiles', 'Instance Profiles', 'Pass roles to EC2 instances', 'aws', 'security', 'Server'),
  n('iam-permission-boundaries', 'Permission Boundaries', 'Maximum permission guardrails', 'aws', 'security', 'Shield'),
  n('iam-access-keys', 'Access Keys', 'Long-term programmatic credentials', 'aws', 'security', 'Key'),
  n('iam-access-analyzer', 'Access Analyzer', 'Policy validation & access analysis', 'aws', 'security', 'Search'),
];

export const iamEdges: CloudEdge[] = [
  e('iam-users', 'iam-groups', 'Belong to'),
  e('iam-policies', 'iam-users', 'Attached to'),
  e('iam-policies', 'iam-roles', 'Attached to'),
  e('iam-policies', 'iam-groups', 'Attached to'),
  e('iam-mfa', 'iam-users', 'Protects'),
  e('iam-sts', 'iam-roles', 'Issues tokens'),
  e('iam-sts', 'iam-users', 'Session tokens'),
  e('iam-idp', 'iam-roles', 'Federate into'),
  e('iam-instance-profiles', 'iam-roles', 'Contains'),
  e('iam-permission-boundaries', 'iam-users', 'Limits'),
  e('iam-permission-boundaries', 'iam-roles', 'Limits'),
  e('iam-access-keys', 'iam-users', 'Issued to'),
  e('iam-access-analyzer', 'iam-policies', 'Validates'),
];

export const ec2Nodes: CloudNode[] = [
  n('ec2-instances', 'Instances', 'Virtual servers in the cloud', 'aws', 'compute', 'Server'),
  n('ec2-ami', 'AMIs', 'Pre-configured machine images', 'aws', 'compute', 'Image'),
  n('ec2-asg', 'Auto Scaling Groups', 'Automatic scaling & instance management', 'aws', 'compute', 'Maximize'),
  n('ec2-ebs', 'EBS Volumes', 'Persistent block storage', 'aws', 'storage', 'HardDrive'),
  n('ec2-sg', 'Security Groups', 'Instance-level firewalls', 'aws', 'security', 'Shield'),
  n('ec2-keypairs', 'Key Pairs', 'SSH/RDP access credentials', 'aws', 'security', 'Key'),
  n('ec2-launch-templates', 'Launch Templates', 'Reusable instance configuration', 'aws', 'compute', 'FileText'),
  n('ec2-eni', 'ENIs', 'Elastic Network Interfaces', 'aws', 'networking', 'Network'),
  n('ec2-eip', 'Elastic IPs', 'Static public IPv4 addresses', 'aws', 'networking', 'MapPin'),
  n('ec2-instance-store', 'Instance Store', 'Ephemeral local block storage', 'aws', 'storage', 'HardDrive'),
  n('ec2-placement-groups', 'Placement Groups', 'Cluster, Spread, or Partition placement', 'aws', 'compute', 'LayoutDashboard'),
];

export const ec2Edges: CloudEdge[] = [
  e('ec2-ami', 'ec2-instances', 'Launches'),
  e('ec2-launch-templates', 'ec2-asg', 'Configures'),
  e('ec2-launch-templates', 'ec2-instances', 'Defines'),
  e('ec2-asg', 'ec2-instances', 'Manages'),
  e('ec2-ebs', 'ec2-instances', 'Attached to'),
  e('ec2-instance-store', 'ec2-instances', 'Local to'),
  e('ec2-sg', 'ec2-eni', 'Attached to'),
  e('ec2-eni', 'ec2-instances', 'Attached to'),
  e('ec2-eip', 'ec2-eni', 'Associated with'),
  e('ec2-keypairs', 'ec2-instances', 'SSH access'),
  e('ec2-placement-groups', 'ec2-instances', 'Places'),
];

export const s3Nodes: CloudNode[] = [
  n('s3-buckets', 'Buckets', 'Object storage containers in a Region', 'aws', 'storage', 'FolderOpen'),
  n('s3-objects', 'Objects', 'Files, data, and metadata with unique keys', 'aws', 'storage', 'File'),
  n('s3-versioning', 'Versioning', 'Object version history & recovery', 'aws', 'storage', 'History'),
  n('s3-lifecycle', 'Lifecycle Rules', 'Auto-transition classes & expire objects', 'aws', 'storage', 'RefreshCw'),
  n('s3-encryption', 'Encryption', 'SSE-S3 (default), SSE-KMS, DSSE-KMS, client-side', 'aws', 'security', 'Lock'),
  n('s3-policies', 'Bucket Policies', 'JSON resource-based access control', 'aws', 'security', 'FileText'),
  n('s3-storage-classes', 'Storage Classes', 'Standard, IA, Glacier, Deep Archive, etc.', 'aws', 'storage', 'Layers'),
  n('s3-event-notifications', 'Event Notifications', 'Triggers on object create/delete/etc.', 'aws', 'messaging', 'Bell'),
  n('s3-replication', 'Replication', 'Cross-Region (CRR) & Same-Region (SRR)', 'aws', 'storage', 'Copy'),
];

export const s3Edges: CloudEdge[] = [
  e('s3-buckets', 's3-objects', 'Contains'),
  e('s3-versioning', 's3-objects', 'Tracks'),
  e('s3-lifecycle', 's3-objects', 'Manages'),
  e('s3-lifecycle', 's3-storage-classes', 'Transitions to'),
  e('s3-encryption', 's3-objects', 'Encrypts'),
  e('s3-policies', 's3-buckets', 'Controls'),
  e('s3-storage-classes', 's3-objects', 'Stores'),
  e('s3-event-notifications', 's3-objects', 'Monitors'),
  e('s3-replication', 's3-buckets', 'Replicates'),
  e('s3-replication', 's3-versioning', 'Requires'),
];

export const rdsNodes: CloudNode[] = [
  n('rds-instances', 'DB Instances', 'Isolated database environments', 'aws', 'database', 'Database'),
  n('rds-replicas', 'Read Replicas', 'Async read-only copies for scaling', 'aws', 'database', 'Copy'),
  n('rds-multi-az', 'Multi-AZ', 'Synchronous standby for HA failover', 'aws', 'database', 'Shield'),
  n('rds-snapshots', 'Snapshots', 'Manual point-in-time backups', 'aws', 'database', 'Camera'),
  n('rds-automated-backups', 'Automated Backups', 'Daily snapshots + transaction logs for PITR', 'aws', 'database', 'RefreshCw'),
  n('rds-pg', 'Parameter Groups', 'Engine configuration values', 'aws', 'database', 'Settings'),
  n('rds-subnet-group', 'Subnet Groups', 'Subnets for DB placement (2+ AZs)', 'aws', 'networking', 'Network'),
  n('rds-proxy', 'RDS Proxy', 'Managed connection pooling & faster failover', 'aws', 'database', 'GitBranch'),
  n('rds-perf-insights', 'Performance Insights', 'DB load monitoring & tuning', 'aws', 'monitoring', 'BarChart3'),
];

export const rdsEdges: CloudEdge[] = [
  e('rds-instances', 'rds-replicas', 'Replicates to'),
  e('rds-multi-az', 'rds-instances', 'Failover'),
  e('rds-snapshots', 'rds-instances', 'Backs up'),
  e('rds-automated-backups', 'rds-instances', 'Continuous backup'),
  e('rds-pg', 'rds-instances', 'Configures'),
  e('rds-subnet-group', 'rds-instances', 'Network'),
  e('rds-proxy', 'rds-instances', 'Pools connections'),
  e('rds-perf-insights', 'rds-instances', 'Analyzes'),
];

export const lambdaNodes: CloudNode[] = [
  n('lambda-functions', 'Functions', 'Serverless code that runs on invocation', 'aws', 'serverless', 'Zap'),
  n('lambda-layers', 'Layers', 'Shared code, libraries & custom runtimes', 'aws', 'serverless', 'Layers'),
  n('lambda-triggers', 'Event Sources', 'API GW, S3, SQS, Kinesis, DynamoDB, etc.', 'aws', 'serverless', 'ArrowDownToLine'),
  n('lambda-destinations', 'Destinations', 'Async success/failure routing to SQS/SNS/Lambda', 'aws', 'serverless', 'ArrowUpRight'),
  n('lambda-reserved', 'Reserved Concurrency', 'Guaranteed capacity cap (free)', 'aws', 'serverless', 'Maximize'),
  n('lambda-provisioned', 'Provisioned Concurrency', 'Pre-initialized environments (no cold starts)', 'aws', 'serverless', 'Gauge'),
  n('lambda-versions', 'Versions & Aliases', 'Immutable snapshots & weighted traffic shifting', 'aws', 'serverless', 'GitBranch'),
  n('lambda-env-vars', 'Environment Variables', 'Key-value runtime configuration', 'aws', 'serverless', 'Settings'),
  n('lambda-vpc', 'VPC Configuration', 'Private resource access via ENIs', 'aws', 'networking', 'Network'),
  n('lambda-dlq', 'Dead Letter Queue', 'SQS/SNS target for failed async invocations', 'aws', 'serverless', 'Inbox'),
];

export const lambdaEdges: CloudEdge[] = [
  e('lambda-triggers', 'lambda-functions', 'Invokes'),
  e('lambda-layers', 'lambda-functions', 'Included in'),
  e('lambda-functions', 'lambda-destinations', 'Routes to'),
  e('lambda-functions', 'lambda-dlq', 'Failed events'),
  e('lambda-reserved', 'lambda-functions', 'Caps & reserves'),
  e('lambda-provisioned', 'lambda-versions', 'Pre-warms'),
  e('lambda-versions', 'lambda-functions', 'Snapshot of'),
  e('lambda-env-vars', 'lambda-functions', 'Configures'),
  e('lambda-vpc', 'lambda-functions', 'Connects'),
];

export const cloudwatchNodes: CloudNode[] = [
  n('cw-metrics', 'Metrics', 'Time-series data points (1s–5min granularity)', 'aws', 'monitoring', 'BarChart3'),
  n('cw-alarms', 'Alarms', 'Threshold-based alerts with actions', 'aws', 'monitoring', 'Bell'),
  n('cw-composite-alarms', 'Composite Alarms', 'Combine multiple alarms to reduce noise', 'aws', 'monitoring', 'Bell'),
  n('cw-logs', 'Logs', 'Log collection, storage & management', 'aws', 'monitoring', 'FileText'),
  n('cw-logs-insights', 'Logs Insights', 'Interactive SQL-based log queries', 'aws', 'monitoring', 'Search'),
  n('cw-dashboards', 'Dashboards', 'Unified metric & log visualization', 'aws', 'monitoring', 'LayoutDashboard'),
  n('cw-anomaly-detection', 'Anomaly Detection', 'ML-based dynamic thresholds', 'aws', 'monitoring', 'Activity'),
  n('cw-container-insights', 'Container Insights', 'ECS/EKS/Fargate monitoring', 'aws', 'monitoring', 'Box'),
  n('cw-synthetics', 'Synthetics', 'Canary scripts for endpoint monitoring', 'aws', 'monitoring', 'Globe'),
];

export const cloudwatchEdges: CloudEdge[] = [
  e('cw-metrics', 'cw-alarms', 'Triggers'),
  e('cw-metrics', 'cw-dashboards', 'Displayed on'),
  e('cw-metrics', 'cw-anomaly-detection', 'Analyzed by'),
  e('cw-anomaly-detection', 'cw-alarms', 'Auto-adjusts'),
  e('cw-alarms', 'cw-composite-alarms', 'Combined into'),
  e('cw-logs', 'cw-metrics', 'Filters to'),
  e('cw-logs', 'cw-logs-insights', 'Queried by'),
  e('cw-logs', 'cw-dashboards', 'Displayed on'),
  e('cw-container-insights', 'cw-metrics', 'Publishes'),
  e('cw-container-insights', 'cw-logs', 'Publishes'),
  e('cw-synthetics', 'cw-metrics', 'Publishes'),
  e('cw-synthetics', 'cw-alarms', 'Triggers'),
];

// ═══════════════════════════════════════════════════════════════════════
// AWS Route 53 — DNS internals
// ═══════════════════════════════════════════════════════════════════════
export const route53Nodes: CloudNode[] = [
  n('r53-hosted-zones', 'Hosted Zones', 'DNS record containers (public & private)', 'aws', 'networking', 'FolderOpen'),
  n('r53-records', 'Record Sets', 'A, AAAA, CNAME, MX, Alias records', 'aws', 'networking', 'FileText'),
  n('r53-health-checks', 'Health Checks', 'Endpoint health monitoring (HTTP/TCP/HTTPS)', 'aws', 'monitoring', 'HeartPulse'),
  n('r53-routing', 'Routing Policies', 'Simple, Weighted, Latency, Failover, Geo', 'aws', 'networking', 'GitBranch'),
  n('r53-resolver', 'Resolver', 'Recursive DNS for VPCs & on-premises', 'aws', 'networking', 'Globe'),
  n('r53-dns-firewall', 'DNS Firewall', 'Malicious domain blocking', 'aws', 'security', 'Shield'),
];

export const route53Edges: CloudEdge[] = [
  e('r53-hosted-zones', 'r53-records', 'Contains'),
  e('r53-health-checks', 'r53-records', 'Monitors'),
  e('r53-routing', 'r53-records', 'Applied to'),
  e('r53-resolver', 'r53-hosted-zones', 'Resolves'),
  e('r53-dns-firewall', 'r53-resolver', 'Protects'),
];

// ═══════════════════════════════════════════════════════════════════════
// AWS ELB — Load Balancing internals
// ═══════════════════════════════════════════════════════════════════════
export const elbNodes: CloudNode[] = [
  n('elb-alb', 'ALB', 'Application LB – Layer 7 HTTP/HTTPS/gRPC', 'aws', 'networking', 'Globe'),
  n('elb-nlb', 'NLB', 'Network LB – Layer 4 TCP/UDP, ultra-low latency', 'aws', 'networking', 'Zap'),
  n('elb-gwlb', 'GWLB', 'Gateway LB – Layer 3 for network appliances', 'aws', 'networking', 'Shield'),
  n('elb-target-groups', 'Target Groups', 'EC2, IP, Lambda, or ALB targets', 'aws', 'networking', 'Users'),
  n('elb-listeners', 'Listeners', 'Protocol/port connection handlers', 'aws', 'networking', 'ArrowDownToLine'),
  n('elb-health-checks', 'Health Checks', 'Target health monitoring', 'aws', 'monitoring', 'HeartPulse'),
  n('elb-rules', 'Listener Rules', 'Path/host/header-based routing (ALB)', 'aws', 'networking', 'GitBranch'),
];

export const elbEdges: CloudEdge[] = [
  e('elb-alb', 'elb-listeners', 'Has'),
  e('elb-nlb', 'elb-listeners', 'Has'),
  e('elb-gwlb', 'elb-listeners', 'Has'),
  e('elb-listeners', 'elb-rules', 'Evaluates'),
  e('elb-rules', 'elb-target-groups', 'Routes to'),
  e('elb-listeners', 'elb-target-groups', 'Routes to'),
  e('elb-health-checks', 'elb-target-groups', 'Monitors'),
];

// ═══════════════════════════════════════════════════════════════════════
// AWS SQS — Queue internals
// ═══════════════════════════════════════════════════════════════════════
export const sqsNodes: CloudNode[] = [
  n('sqs-standard', 'Standard Queues', 'Best-effort ordering, at-least-once delivery', 'aws', 'messaging', 'Inbox'),
  n('sqs-fifo', 'FIFO Queues', 'Strict ordering, exactly-once processing', 'aws', 'messaging', 'Inbox'),
  n('sqs-dlq', 'Dead Letter Queues', 'Failed message handling after max retries', 'aws', 'messaging', 'AlertCircle'),
  n('sqs-visibility', 'Visibility Timeout', 'Message lock during processing (default 30s)', 'aws', 'messaging', 'Clock'),
  n('sqs-long-polling', 'Long Polling', 'Efficient retrieval, reduces empty responses', 'aws', 'messaging', 'RefreshCw'),
  n('sqs-msg-attrs', 'Message Attributes', 'Metadata for filtering & routing', 'aws', 'messaging', 'FileText'),
];

export const sqsEdges: CloudEdge[] = [
  e('sqs-standard', 'sqs-dlq', 'Redirects failed'),
  e('sqs-fifo', 'sqs-dlq', 'Redirects failed'),
  e('sqs-visibility', 'sqs-standard', 'Controls'),
  e('sqs-visibility', 'sqs-fifo', 'Controls'),
  e('sqs-long-polling', 'sqs-standard', 'Retrieves from'),
  e('sqs-long-polling', 'sqs-fifo', 'Retrieves from'),
  e('sqs-msg-attrs', 'sqs-standard', 'Attached to'),
  e('sqs-msg-attrs', 'sqs-fifo', 'Attached to'),
];

// ═══════════════════════════════════════════════════════════════════════
// AWS SNS — Notification internals
// ═══════════════════════════════════════════════════════════════════════
export const snsNodes: CloudNode[] = [
  n('sns-standard-topics', 'Standard Topics', 'High-throughput, best-effort ordering', 'aws', 'messaging', 'Bell'),
  n('sns-fifo-topics', 'FIFO Topics', 'Strict ordering, exactly-once delivery', 'aws', 'messaging', 'Bell'),
  n('sns-subscriptions', 'Subscriptions', 'SQS, Lambda, HTTP, email, SMS endpoints', 'aws', 'messaging', 'Users'),
  n('sns-filtering', 'Message Filtering', 'Attribute-based subscription routing', 'aws', 'messaging', 'Filter'),
  n('sns-dlq', 'Dead Letter Queues', 'Failed delivery handling (via SQS)', 'aws', 'messaging', 'AlertCircle'),
];

export const snsEdges: CloudEdge[] = [
  e('sns-standard-topics', 'sns-subscriptions', 'Delivers to'),
  e('sns-fifo-topics', 'sns-subscriptions', 'Delivers to'),
  e('sns-filtering', 'sns-subscriptions', 'Filters'),
  e('sns-subscriptions', 'sns-dlq', 'Failed deliveries'),
];

// ═══════════════════════════════════════════════════════════════════════
// GCP — Service categories
// ═══════════════════════════════════════════════════════════════════════
export const gcpNodes: CloudNode[] = [
  n('gcp-vpc', 'VPC Network', 'Global virtual network', 'gcp', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('gcp-iam', 'Cloud IAM', 'Identity & Access Management', 'gcp', 'security', 'Shield', { isGroup: true, hasChildren: true }),
  n('gcp-gke', 'GKE', 'Google Kubernetes Engine', 'gcp', 'kubernetes', 'Box', { isGroup: true, hasChildren: true }),
  n('gcp-gce', 'Compute Engine', 'Virtual Machines', 'gcp', 'compute', 'Server', { isGroup: true, hasChildren: true }),
  n('gcp-gcs', 'Cloud Storage', 'Object Storage', 'gcp', 'storage', 'HardDrive', { isGroup: true, hasChildren: true }),
  n('gcp-cloudsql', 'Cloud SQL', 'Managed Relational DB', 'gcp', 'database', 'Database', { isGroup: true, hasChildren: true }),
  n('gcp-functions', 'Cloud Functions', 'Serverless Functions', 'gcp', 'serverless', 'Zap', { isGroup: true, hasChildren: true }),
  n('gcp-monitoring', 'Cloud Monitoring', 'Ops Suite Monitoring', 'gcp', 'monitoring', 'Activity', { isGroup: true, hasChildren: true }),
  n('gcp-dns', 'Cloud DNS', 'DNS Service', 'gcp', 'networking', 'Globe'),
  n('gcp-lb', 'Cloud Load Balancing', 'Global Load Balancer', 'gcp', 'networking', 'GitBranch'),
  n('gcp-pubsub', 'Pub/Sub', 'Messaging Service', 'gcp', 'messaging', 'Inbox'),
  n('gcp-bigquery', 'BigQuery', 'Data Warehouse', 'gcp', 'database', 'Database'),
];

export const gcpEdges: CloudEdge[] = [
  e('gcp-dns', 'gcp-lb', 'DNS'),
  e('gcp-lb', 'gcp-gke', 'Traffic'),
  e('gcp-lb', 'gcp-gce', 'Traffic'),
  e('gcp-gke', 'gcp-gce', 'Runs on'),
  e('gcp-gce', 'gcp-vpc', 'Inside'),
  e('gcp-gke', 'gcp-vpc', 'Inside'),
  e('gcp-gke', 'gcp-iam', 'Auth'),
  e('gcp-gce', 'gcp-gcs', 'Read/Write'),
  e('gcp-gce', 'gcp-cloudsql', 'Query'),
  e('gcp-functions', 'gcp-gcs', 'Trigger'),
  e('gcp-functions', 'gcp-pubsub', 'Subscribe'),
  e('gcp-functions', 'gcp-cloudsql', 'Query'),
  e('gcp-monitoring', 'gcp-gce', 'Monitors'),
  e('gcp-monitoring', 'gcp-gke', 'Monitors'),
  e('gcp-monitoring', 'gcp-functions', 'Monitors'),
  e('gcp-functions', 'gcp-vpc', 'Inside'),
  e('gcp-pubsub', 'gcp-bigquery', 'Streams to'),
];

// ─── GKE internals ────────────────────────────────────────────────────
export const gkeNodes: CloudNode[] = [
  n('gke-control-plane', 'Control Plane', 'Managed by Google', 'gcp', 'control-plane', 'Cpu', { isGroup: true, hasChildren: true }),
  n('gke-node-pools', 'Node Pools', 'Groups of worker VMs', 'gcp', 'worker-node', 'Server', { isGroup: true, hasChildren: true }),
  n('gke-networking', 'Cluster Networking', 'VPC-native networking', 'gcp', 'networking', 'Network', { isGroup: true, hasChildren: true }),
];

export const gkeEdges: CloudEdge[] = [
  e('gke-control-plane', 'gke-node-pools', 'Manages'),
  e('gke-networking', 'gke-node-pools', 'Connects'),
  e('gke-networking', 'gke-control-plane', 'Connects'),
];

export const gkeControlPlaneNodes: CloudNode[] = [
  n('gke-cp-api', 'API Server', 'kube-apiserver', 'gcp', 'control-plane', 'Globe'),
  n('gke-cp-etcd', 'etcd', 'Cluster state store', 'gcp', 'control-plane', 'Database'),
  n('gke-cp-scheduler', 'Scheduler', 'Pod scheduling', 'gcp', 'control-plane', 'Calendar'),
  n('gke-cp-controller', 'Controller Manager', 'Reconciliation loops', 'gcp', 'control-plane', 'Settings'),
  n('gke-cp-cloud-controller', 'Cloud Controller', 'GCP resource management', 'gcp', 'control-plane', 'Cloud'),
];

export const gkeControlPlaneEdges: CloudEdge[] = [
  e('gke-cp-api', 'gke-cp-etcd', 'Read/Write'),
  e('gke-cp-scheduler', 'gke-cp-api', 'Watch'),
  e('gke-cp-controller', 'gke-cp-api', 'Watch & update'),
  e('gke-cp-cloud-controller', 'gke-cp-api', 'Watch & update'),
];

export const gkeNodePoolNodes: CloudNode[] = [
  n('gke-np-kubelet', 'Kubelet', 'Node agent', 'gcp', 'worker-node', 'Cpu'),
  n('gke-np-proxy', 'kube-proxy', 'Network proxy', 'gcp', 'worker-node', 'Network'),
  n('gke-np-runtime', 'Container Runtime', 'containerd', 'gcp', 'worker-node', 'Box'),
  n('gke-np-pods', 'Pods', 'Application workloads', 'gcp', 'worker-node', 'Layers'),
];

export const gkeNodePoolEdges: CloudEdge[] = [
  e('gke-np-kubelet', 'gke-np-runtime', 'Manages'),
  e('gke-np-runtime', 'gke-np-pods', 'Runs'),
  e('gke-np-proxy', 'gke-np-pods', 'Routes to'),
];

export const gkeNetworkingNodes: CloudNode[] = [
  n('gke-net-vpc-native', 'VPC-Native', 'Alias IP ranges for pods', 'gcp', 'networking', 'Network'),
  n('gke-net-dns', 'kube-dns', 'Cluster DNS', 'gcp', 'networking', 'Globe'),
  n('gke-net-ingress', 'GKE Ingress', 'Google Cloud Load Balancer', 'gcp', 'networking', 'ArrowDownToLine'),
  n('gke-net-services', 'Services', 'ClusterIP, NodePort, LoadBalancer', 'gcp', 'networking', 'GitBranch'),
];

export const gkeNetworkingEdges: CloudEdge[] = [
  e('gke-net-ingress', 'gke-net-services', 'Routes to'),
  e('gke-net-services', 'gke-net-dns', 'Resolves via'),
  e('gke-net-vpc-native', 'gke-net-services', 'Provides IPs'),
];

// ═══════════════════════════════════════════════════════════════════════
// Azure — Service categories
// ═══════════════════════════════════════════════════════════════════════
export const azureNodes: CloudNode[] = [
  n('az-vnet', 'Virtual Network', 'VNet – isolated network', 'azure', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('az-ad', 'Entra ID', 'Identity & Access (Azure AD)', 'azure', 'security', 'Shield', { isGroup: true, hasChildren: true }),
  n('az-aks', 'AKS', 'Azure Kubernetes Service', 'azure', 'kubernetes', 'Box', { isGroup: true, hasChildren: true }),
  n('az-vm', 'Virtual Machines', 'Azure VMs', 'azure', 'compute', 'Server', { isGroup: true, hasChildren: true }),
  n('az-blob', 'Blob Storage', 'Object Storage', 'azure', 'storage', 'HardDrive', { isGroup: true, hasChildren: true }),
  n('az-sql', 'Azure SQL', 'Managed SQL Database', 'azure', 'database', 'Database', { isGroup: true, hasChildren: true }),
  n('az-functions', 'Azure Functions', 'Serverless Compute', 'azure', 'serverless', 'Zap', { isGroup: true, hasChildren: true }),
  n('az-monitor', 'Azure Monitor', 'Monitoring & Diagnostics', 'azure', 'monitoring', 'Activity', { isGroup: true, hasChildren: true }),
  n('az-dns', 'Azure DNS', 'DNS Service', 'azure', 'networking', 'Globe'),
  n('az-lb', 'Load Balancer', 'Azure Load Balancer', 'azure', 'networking', 'GitBranch'),
  n('az-servicebus', 'Service Bus', 'Messaging Service', 'azure', 'messaging', 'Inbox'),
  n('az-cosmos', 'Cosmos DB', 'Multi-model NoSQL', 'azure', 'database', 'Database'),
];

export const azureEdges: CloudEdge[] = [
  e('az-dns', 'az-lb', 'DNS'),
  e('az-lb', 'az-aks', 'Traffic'),
  e('az-lb', 'az-vm', 'Traffic'),
  e('az-aks', 'az-vm', 'Runs on'),
  e('az-vm', 'az-vnet', 'Inside'),
  e('az-aks', 'az-vnet', 'Inside'),
  e('az-aks', 'az-ad', 'Auth'),
  e('az-vm', 'az-blob', 'Read/Write'),
  e('az-vm', 'az-sql', 'Query'),
  e('az-functions', 'az-blob', 'Trigger'),
  e('az-functions', 'az-servicebus', 'Subscribe'),
  e('az-functions', 'az-sql', 'Query'),
  e('az-monitor', 'az-vm', 'Monitors'),
  e('az-monitor', 'az-aks', 'Monitors'),
  e('az-monitor', 'az-functions', 'Monitors'),
  e('az-functions', 'az-vnet', 'Inside'),
  e('az-cosmos', 'az-vnet', 'Inside'),
];

// ─── AKS internals ────────────────────────────────────────────────────
export const aksNodes: CloudNode[] = [
  n('aks-control-plane', 'Control Plane', 'Managed by Azure', 'azure', 'control-plane', 'Cpu', { isGroup: true, hasChildren: true }),
  n('aks-node-pools', 'Node Pools', 'VMSS-backed worker nodes', 'azure', 'worker-node', 'Server', { isGroup: true, hasChildren: true }),
  n('aks-networking', 'Cluster Networking', 'Azure CNI / Kubenet', 'azure', 'networking', 'Network', { isGroup: true, hasChildren: true }),
];

export const aksEdges: CloudEdge[] = [
  e('aks-control-plane', 'aks-node-pools', 'Manages'),
  e('aks-networking', 'aks-node-pools', 'Connects'),
  e('aks-networking', 'aks-control-plane', 'Connects'),
];

export const aksControlPlaneNodes: CloudNode[] = [
  n('aks-cp-api', 'API Server', 'kube-apiserver', 'azure', 'control-plane', 'Globe'),
  n('aks-cp-etcd', 'etcd', 'Cluster state store', 'azure', 'control-plane', 'Database'),
  n('aks-cp-scheduler', 'Scheduler', 'Pod scheduling', 'azure', 'control-plane', 'Calendar'),
  n('aks-cp-controller', 'Controller Manager', 'Reconciliation loops', 'azure', 'control-plane', 'Settings'),
  n('aks-cp-cloud-controller', 'Cloud Controller', 'Azure resource management', 'azure', 'control-plane', 'Cloud'),
];

export const aksControlPlaneEdges: CloudEdge[] = [
  e('aks-cp-api', 'aks-cp-etcd', 'Read/Write'),
  e('aks-cp-scheduler', 'aks-cp-api', 'Watch'),
  e('aks-cp-controller', 'aks-cp-api', 'Watch & update'),
  e('aks-cp-cloud-controller', 'aks-cp-api', 'Watch & update'),
];

export const aksNodePoolNodes: CloudNode[] = [
  n('aks-np-kubelet', 'Kubelet', 'Node agent', 'azure', 'worker-node', 'Cpu'),
  n('aks-np-proxy', 'kube-proxy', 'Network proxy', 'azure', 'worker-node', 'Network'),
  n('aks-np-runtime', 'Container Runtime', 'containerd', 'azure', 'worker-node', 'Box'),
  n('aks-np-pods', 'Pods', 'Application workloads', 'azure', 'worker-node', 'Layers'),
];

export const aksNodePoolEdges: CloudEdge[] = [
  e('aks-np-kubelet', 'aks-np-runtime', 'Manages'),
  e('aks-np-runtime', 'aks-np-pods', 'Runs'),
  e('aks-np-proxy', 'aks-np-pods', 'Routes to'),
];

export const aksNetworkingNodes: CloudNode[] = [
  n('aks-net-cni', 'Azure CNI', 'VNet IPs for pods', 'azure', 'networking', 'Network'),
  n('aks-net-dns', 'CoreDNS', 'Cluster DNS', 'azure', 'networking', 'Globe'),
  n('aks-net-ingress', 'AGIC', 'Application Gateway Ingress', 'azure', 'networking', 'ArrowDownToLine'),
  n('aks-net-services', 'Services', 'ClusterIP, NodePort, LoadBalancer', 'azure', 'networking', 'GitBranch'),
];

export const aksNetworkingEdges: CloudEdge[] = [
  e('aks-net-ingress', 'aks-net-services', 'Routes to'),
  e('aks-net-services', 'aks-net-dns', 'Resolves via'),
  e('aks-net-cni', 'aks-net-services', 'Provides IPs'),
];

// ═══════════════════════════════════════════════════════════════════════
// Graph Registry — maps node IDs to their drill-down content
// ═══════════════════════════════════════════════════════════════════════
export interface GraphLevel {
  label: string;
  description: string;
  nodes: CloudNode[];
  edges: CloudEdge[];
}

export const graphRegistry: Record<string, GraphLevel> = {
  root: { label: 'Cloud Providers', description: 'Multi-cloud overview', nodes: topLevelNodes, edges: topLevelEdges },

  // AWS
  aws: { label: 'AWS', description: 'Amazon Web Services', nodes: awsNodes, edges: awsEdges },
  'aws-vpc': { label: 'VPC', description: 'Virtual Private Cloud', nodes: vpcNodes, edges: vpcEdges },
  'aws-iam': { label: 'IAM', description: 'Identity & Access Management', nodes: iamNodes, edges: iamEdges },
  'aws-eks': { label: 'EKS', description: 'Elastic Kubernetes Service', nodes: eksNodes, edges: eksEdges },
  'aws-ec2': { label: 'EC2', description: 'Elastic Compute Cloud', nodes: ec2Nodes, edges: ec2Edges },
  'aws-s3': { label: 'S3', description: 'Simple Storage Service', nodes: s3Nodes, edges: s3Edges },
  'aws-rds': { label: 'RDS', description: 'Relational Database Service', nodes: rdsNodes, edges: rdsEdges },
  'aws-lambda': { label: 'Lambda', description: 'Serverless Functions', nodes: lambdaNodes, edges: lambdaEdges },
  'aws-cloudwatch': { label: 'CloudWatch', description: 'Monitoring & Observability', nodes: cloudwatchNodes, edges: cloudwatchEdges },
  'aws-route53': { label: 'Route 53', description: 'DNS, Registration & Health Checks', nodes: route53Nodes, edges: route53Edges },
  'aws-elb': { label: 'ELB', description: 'Elastic Load Balancing', nodes: elbNodes, edges: elbEdges },
  'aws-sqs': { label: 'SQS', description: 'Simple Queue Service', nodes: sqsNodes, edges: sqsEdges },
  'aws-sns': { label: 'SNS', description: 'Simple Notification Service', nodes: snsNodes, edges: snsEdges },

  // EKS deep-dive
  'eks-control-plane': { label: 'EKS Control Plane', description: 'Kubernetes control plane components', nodes: eksControlPlaneNodes, edges: eksControlPlaneEdges },
  'eks-worker-nodes': { label: 'Worker Nodes', description: 'EC2 instances running pods', nodes: eksWorkerNodes, edges: eksWorkerEdges },
  'eks-networking': { label: 'Cluster Networking', description: 'VPC CNI & service networking', nodes: eksNetworkingNodes, edges: eksNetworkingEdges },
  'wn-pods': { label: 'Pods', description: 'Pod internals', nodes: podNodes, edges: podEdges },

  // GCP
  gcp: { label: 'GCP', description: 'Google Cloud Platform', nodes: gcpNodes, edges: gcpEdges },
  'gcp-gke': { label: 'GKE', description: 'Google Kubernetes Engine', nodes: gkeNodes, edges: gkeEdges },
  'gke-control-plane': { label: 'GKE Control Plane', description: 'Kubernetes control plane', nodes: gkeControlPlaneNodes, edges: gkeControlPlaneEdges },
  'gke-node-pools': { label: 'Node Pools', description: 'Worker VM groups', nodes: gkeNodePoolNodes, edges: gkeNodePoolEdges },
  'gke-networking': { label: 'GKE Networking', description: 'VPC-native networking', nodes: gkeNetworkingNodes, edges: gkeNetworkingEdges },

  // Azure
  azure: { label: 'Azure', description: 'Microsoft Azure', nodes: azureNodes, edges: azureEdges },
  'az-aks': { label: 'AKS', description: 'Azure Kubernetes Service', nodes: aksNodes, edges: aksEdges },
  'aks-control-plane': { label: 'AKS Control Plane', description: 'Kubernetes control plane', nodes: aksControlPlaneNodes, edges: aksControlPlaneEdges },
  'aks-node-pools': { label: 'Node Pools', description: 'VMSS worker nodes', nodes: aksNodePoolNodes, edges: aksNodePoolEdges },
  'aks-networking': { label: 'AKS Networking', description: 'Azure CNI networking', nodes: aksNetworkingNodes, edges: aksNetworkingEdges },
};
