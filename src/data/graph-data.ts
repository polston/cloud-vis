import type { CloudNode, CloudEdge, GatewayType } from '../types';
import { categoryColors } from './providers';

// ─── Helper to build nodes ────────────────────────────────────────────
function n(
  id: string,
  label: string,
  description: string,
  provider: 'aws' | 'gcp' | 'azure',
  category: string,
  icon: string,
  opts: { isGroup?: boolean; hasChildren?: boolean; gatewayType?: GatewayType } = {}
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
      ...(opts.gatewayType ? { gatewayType: opts.gatewayType } : {}),
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
  n('aws-route53', 'Route 53', 'DNS, domain registration & health checks', 'aws', 'networking', 'Globe', { isGroup: true, hasChildren: true, gatewayType: 'ingress' }),
  n('aws-elb', 'ELB', 'Elastic Load Balancing – distributes traffic', 'aws', 'networking', 'GitBranch', { isGroup: true, hasChildren: true, gatewayType: 'ingress' }),
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
  e('aws-s3', 'aws-lambda', 'Triggers'),
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
  e('aws-ec2', 'aws-iam', 'Auth'),
  e('aws-lambda', 'aws-iam', 'Auth'),
  e('aws-rds', 'aws-vpc', 'Inside'),
  e('aws-lambda', 'aws-s3', 'Read/Write'),
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
  n('eks-pod-identity', 'Pod Identity', 'Pod-level IAM credentials (simpler alternative to IRSA)', 'aws', 'security', 'Key'),
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
  n('net-ingress', 'AWS LB Controller', 'Routes external traffic via ALB/NLB', 'aws', 'networking', 'ArrowDownToLine', { gatewayType: 'ingress' }),
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
  n('vpc-igw', 'Internet Gateway', 'Bidirectional VPC-to-internet access', 'aws', 'networking', 'Globe', { gatewayType: 'both' }),
  n('vpc-nat', 'NAT Gateway', 'Outbound internet for private subnets', 'aws', 'networking', 'ArrowUpRight', { gatewayType: 'egress' }),
  n('vpc-sg', 'Security Groups', 'Stateful ENI-level firewall (allow only)', 'aws', 'security', 'Shield'),
  n('vpc-nacl', 'NACLs', 'Stateless subnet-level firewall (allow & deny)', 'aws', 'security', 'ShieldCheck'),
  n('vpc-rt', 'Route Tables', 'Routing rules for subnets & gateways', 'aws', 'networking', 'GitBranch'),
  n('vpc-endpoints', 'VPC Endpoints', 'Private access to AWS services (Gateway & Interface)', 'aws', 'networking', 'Link', { gatewayType: 'egress' }),
  n('vpc-peering', 'VPC Peering', 'Non-transitive VPC-to-VPC connectivity', 'aws', 'networking', 'Link', { gatewayType: 'both' }),
  n('vpc-flow-logs', 'Flow Logs', 'IP traffic logging for VPC/subnet/ENI', 'aws', 'monitoring', 'FileText'),
  n('vpc-tgw', 'Transit Gateway', 'Hub for multi-VPC & hybrid connectivity', 'aws', 'networking', 'GitBranch', { gatewayType: 'both' }),
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
  n('lambda-triggers', 'Event Sources', 'API GW, S3, SQS, Kinesis, DynamoDB, etc.', 'aws', 'serverless', 'ArrowDownToLine', { gatewayType: 'ingress' }),
  n('lambda-destinations', 'Destinations', 'Async success/failure routing to SQS/SNS/Lambda/EventBridge', 'aws', 'serverless', 'ArrowUpRight', { gatewayType: 'egress' }),
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
  n('cw-logs-insights', 'Logs Insights', 'Interactive log query engine (custom QL & SQL)', 'aws', 'monitoring', 'Search'),
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
  n('elb-listeners', 'Listeners', 'Protocol/port connection handlers', 'aws', 'networking', 'ArrowDownToLine', { gatewayType: 'ingress' }),
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
  n('gcp-monitoring', 'Cloud Monitoring', 'Cloud Monitoring (Observability suite)', 'gcp', 'monitoring', 'Activity', { isGroup: true, hasChildren: true }),
  n('gcp-dns', 'Cloud DNS', 'DNS Service', 'gcp', 'networking', 'Globe', { isGroup: true, hasChildren: true, gatewayType: 'ingress' }),
  n('gcp-lb', 'Cloud Load Balancing', 'Global Load Balancer', 'gcp', 'networking', 'GitBranch', { isGroup: true, hasChildren: true, gatewayType: 'ingress' }),
  n('gcp-pubsub', 'Pub/Sub', 'Messaging Service', 'gcp', 'messaging', 'Inbox', { isGroup: true, hasChildren: true }),
  n('gcp-bigquery', 'BigQuery', 'Data Warehouse', 'gcp', 'analytics', 'Database', { isGroup: true, hasChildren: true }),
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
  e('gcp-gcs', 'gcp-functions', 'Triggers'),
  e('gcp-functions', 'gcp-pubsub', 'Subscribe'),
  e('gcp-functions', 'gcp-cloudsql', 'Query'),
  e('gcp-monitoring', 'gcp-gce', 'Monitors'),
  e('gcp-monitoring', 'gcp-gke', 'Monitors'),
  e('gcp-monitoring', 'gcp-functions', 'Monitors'),
  e('gcp-functions', 'gcp-vpc', 'VPC Connector'),
  e('gcp-pubsub', 'gcp-bigquery', 'Streams to'),
  e('gcp-gce', 'gcp-iam', 'Auth'),
  e('gcp-functions', 'gcp-iam', 'Auth'),
  e('gcp-monitoring', 'gcp-cloudsql', 'Monitors'),
  e('gcp-monitoring', 'gcp-lb', 'Monitors'),
  e('gcp-lb', 'gcp-functions', 'Traffic'),
];

// ─── GKE internals ────────────────────────────────────────────────────
export const gkeNodes: CloudNode[] = [
  n('gke-control-plane', 'Control Plane', 'Managed by Google', 'gcp', 'control-plane', 'Cpu', { isGroup: true, hasChildren: true }),
  n('gke-node-pools', 'Node Pools', 'Groups of worker VMs', 'gcp', 'worker-node', 'Server', { isGroup: true, hasChildren: true }),
  n('gke-networking', 'Cluster Networking', 'VPC-native networking', 'gcp', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('gke-autopilot', 'Autopilot Mode', 'Fully managed node provisioning', 'gcp', 'serverless', 'Cloud'),
  n('gke-addons', 'GKE Add-ons', 'Managed cluster extensions (CSI, DNS, etc.)', 'gcp', 'kubernetes', 'Layers'),
  n('gke-workload-identity', 'Workload Identity', 'Pod-level GCP IAM credentials', 'gcp', 'security', 'Key'),
];

export const gkeEdges: CloudEdge[] = [
  e('gke-control-plane', 'gke-node-pools', 'Manages'),
  e('gke-networking', 'gke-node-pools', 'Connects'),
  e('gke-networking', 'gke-control-plane', 'Connects'),
  e('gke-addons', 'gke-networking', 'Provides'),
  e('gke-workload-identity', 'gke-node-pools', 'Credentials'),
  e('gke-control-plane', 'gke-autopilot', 'Manages'),
  e('gke-networking', 'gke-autopilot', 'Connects'),
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
  n('gke-np-pods', 'Pods', 'Application workloads', 'gcp', 'worker-node', 'Layers', { isGroup: true, hasChildren: true }),
];

export const gkeNodePoolEdges: CloudEdge[] = [
  e('gke-np-kubelet', 'gke-np-runtime', 'Manages'),
  e('gke-np-runtime', 'gke-np-pods', 'Runs'),
  e('gke-np-proxy', 'gke-np-pods', 'Routes to'),
];

export const gkeNetworkingNodes: CloudNode[] = [
  n('gke-net-vpc-native', 'VPC-Native', 'Alias IP ranges for pods', 'gcp', 'networking', 'Network'),
  n('gke-net-dns', 'kube-dns', 'Cluster DNS', 'gcp', 'networking', 'Globe'),
  n('gke-net-ingress', 'GKE Ingress', 'Google Cloud Load Balancer', 'gcp', 'networking', 'ArrowDownToLine', { gatewayType: 'ingress' }),
  n('gke-net-services', 'Services', 'ClusterIP, NodePort, LoadBalancer', 'gcp', 'networking', 'GitBranch'),
  n('gke-net-network-policy', 'Network Policies', 'Pod-to-pod traffic rules', 'gcp', 'security', 'Shield'),
];

export const gkeNetworkingEdges: CloudEdge[] = [
  e('gke-net-ingress', 'gke-net-services', 'Routes to'),
  e('gke-net-services', 'gke-net-dns', 'Resolves via'),
  e('gke-net-vpc-native', 'gke-net-services', 'Provides IPs'),
  e('gke-net-network-policy', 'gke-net-services', 'Filters'),
];

// ─── GKE Pod internals ──────────────────────────────────────────────
export const gkePodNodes: CloudNode[] = [
  n('gke-pod-containers', 'Containers', 'Application containers', 'gcp', 'containers', 'Box'),
  n('gke-pod-init-containers', 'Init Containers', 'Run before app containers', 'gcp', 'containers', 'PlayCircle'),
  n('gke-pod-volumes', 'Volumes', 'Shared storage within pod', 'gcp', 'storage', 'HardDrive'),
  n('gke-pod-secrets', 'Secrets', 'Sensitive data (mounted or env)', 'gcp', 'security', 'Lock'),
  n('gke-pod-configmaps', 'ConfigMaps', 'Configuration data', 'gcp', 'storage', 'FileText'),
  n('gke-pod-service-account', 'Service Account', 'Pod identity for RBAC', 'gcp', 'security', 'User'),
  n('gke-pod-probes', 'Health Probes', 'Liveness, Readiness, Startup', 'gcp', 'monitoring', 'HeartPulse'),
  n('gke-pod-resources', 'Resource Limits', 'CPU & memory requests/limits', 'gcp', 'compute', 'Gauge'),
];

export const gkePodEdges: CloudEdge[] = [
  e('gke-pod-init-containers', 'gke-pod-containers', 'Run before'),
  e('gke-pod-containers', 'gke-pod-volumes', 'Mount'),
  e('gke-pod-containers', 'gke-pod-secrets', 'Mount/Env'),
  e('gke-pod-containers', 'gke-pod-configmaps', 'Mount/Env'),
  e('gke-pod-containers', 'gke-pod-service-account', 'Identity'),
  e('gke-pod-probes', 'gke-pod-containers', 'Checks'),
  e('gke-pod-resources', 'gke-pod-containers', 'Constrains'),
];

// ═══════════════════════════════════════════════════════════════════════
// GCP sub-service details
// ═══════════════════════════════════════════════════════════════════════
export const gcpVpcNodes: CloudNode[] = [
  n('gcp-vpc-subnets', 'Subnets', 'Regional IP ranges in a single region', 'gcp', 'networking', 'Layers'),
  n('gcp-vpc-firewall', 'Firewall Rules', 'Stateful allow/deny rules (VPC-level)', 'gcp', 'security', 'Shield'),
  n('gcp-vpc-nat', 'Cloud NAT', 'Outbound internet for private VMs', 'gcp', 'networking', 'ArrowUpRight', { gatewayType: 'egress' }),
  n('gcp-vpc-router', 'Cloud Router', 'Dynamic BGP routing for hybrid connectivity', 'gcp', 'networking', 'GitBranch'),
  n('gcp-vpc-peering', 'VPC Peering', 'Non-transitive VPC-to-VPC connectivity', 'gcp', 'networking', 'Link', { gatewayType: 'both' }),
  n('gcp-vpc-shared', 'Shared VPC', 'Host/service project network sharing', 'gcp', 'networking', 'Users'),
  n('gcp-vpc-pga', 'Private Google Access', 'Private access to Google APIs', 'gcp', 'networking', 'Lock'),
  n('gcp-vpc-psc', 'Private Service Connect', 'Private endpoints for services', 'gcp', 'networking', 'Link', { gatewayType: 'egress' }),
  n('gcp-vpc-interconnect', 'Cloud Interconnect', 'Dedicated/partner on-prem connectivity', 'gcp', 'networking', 'ArrowLeftRight', { gatewayType: 'both' }),
  n('gcp-vpc-flow-logs', 'VPC Flow Logs', 'Network traffic logging', 'gcp', 'monitoring', 'FileText'),
  n('gcp-vpc-static-ip', 'Static External IPs', 'Reserved public IP addresses', 'gcp', 'networking', 'MapPin'),
  n('gcp-vpc-routes', 'Routes', 'Custom static & dynamic routing rules', 'gcp', 'networking', 'GitBranch'),
];

export const gcpVpcEdges: CloudEdge[] = [
  e('gcp-vpc-firewall', 'gcp-vpc-subnets', 'Filters'),
  e('gcp-vpc-nat', 'gcp-vpc-router', 'Routes through'),
  e('gcp-vpc-nat', 'gcp-vpc-subnets', 'Private outbound'),
  e('gcp-vpc-router', 'gcp-vpc-subnets', 'Routes'),
  e('gcp-vpc-routes', 'gcp-vpc-subnets', 'Directs traffic'),
  e('gcp-vpc-peering', 'gcp-vpc-routes', 'Via routes'),
  e('gcp-vpc-shared', 'gcp-vpc-subnets', 'Shares'),
  e('gcp-vpc-pga', 'gcp-vpc-subnets', 'Private access'),
  e('gcp-vpc-psc', 'gcp-vpc-subnets', 'Endpoint in'),
  e('gcp-vpc-interconnect', 'gcp-vpc-router', 'Via BGP'),
  e('gcp-vpc-flow-logs', 'gcp-vpc-subnets', 'Monitors'),
  e('gcp-vpc-static-ip', 'gcp-vpc-nat', 'Assigned to'),
  e('gcp-vpc-static-ip', 'gcp-vpc-subnets', 'Associated with'),
];

export const gcpIamNodes: CloudNode[] = [
  n('gcp-iam-members', 'Members', 'Users, groups, and domains', 'gcp', 'security', 'User'),
  n('gcp-iam-roles', 'Roles', 'Basic, predefined, and custom roles', 'gcp', 'security', 'UserCheck'),
  n('gcp-iam-policies', 'IAM Policies', 'Allow & deny policy bindings', 'gcp', 'security', 'FileText'),
  n('gcp-iam-sa', 'Service Accounts', 'Machine identities for workloads', 'gcp', 'security', 'Key'),
  n('gcp-iam-wif', 'Workload Identity Federation', 'External IdP federation (OIDC/SAML)', 'gcp', 'security', 'Globe'),
  n('gcp-iam-org-policies', 'Organization Policies', 'Constraint-based guardrails', 'gcp', 'security', 'Shield'),
  n('gcp-iam-conditions', 'IAM Conditions', 'Conditional role bindings (time, resource, IP)', 'gcp', 'security', 'Filter'),
  n('gcp-iam-audit', 'Audit Logs', 'Admin & data access audit trails', 'gcp', 'monitoring', 'FileText'),
  n('gcp-iam-iap', 'Identity-Aware Proxy', 'Context-aware application access', 'gcp', 'security', 'ShieldCheck'),
  n('gcp-iam-recommender', 'IAM Recommender', 'Role & permission recommendations', 'gcp', 'security', 'Search'),
];

export const gcpIamEdges: CloudEdge[] = [
  e('gcp-iam-members', 'gcp-iam-policies', 'Bound via'),
  e('gcp-iam-policies', 'gcp-iam-roles', 'Grants'),
  e('gcp-iam-policies', 'gcp-iam-members', 'Attached to'),
  e('gcp-iam-sa', 'gcp-iam-roles', 'Assigned'),
  e('gcp-iam-sa', 'gcp-iam-policies', 'Bound via'),
  e('gcp-iam-wif', 'gcp-iam-sa', 'Federates into'),
  e('gcp-iam-org-policies', 'gcp-iam-policies', 'Constrains'),
  e('gcp-iam-conditions', 'gcp-iam-policies', 'Restricts'),
  e('gcp-iam-audit', 'gcp-iam-policies', 'Logs'),
  e('gcp-iam-iap', 'gcp-iam-sa', 'Authenticates'),
  e('gcp-iam-recommender', 'gcp-iam-policies', 'Analyzes'),
  e('gcp-iam-recommender', 'gcp-iam-roles', 'Suggests'),
];

export const gcpGceNodes: CloudNode[] = [
  n('gcp-gce-instances', 'VM Instances', 'Virtual machines in the cloud', 'gcp', 'compute', 'Server'),
  n('gcp-gce-images', 'Machine Images', 'Pre-configured VM images', 'gcp', 'compute', 'Image'),
  n('gcp-gce-mig', 'Managed Instance Groups', 'Autoscaling & auto-healing VM groups', 'gcp', 'compute', 'Maximize'),
  n('gcp-gce-pd', 'Persistent Disks', 'Durable block storage (SSD/HDD)', 'gcp', 'storage', 'HardDrive'),
  n('gcp-gce-firewall', 'Firewall Rules', 'Instance-level network rules', 'gcp', 'security', 'Shield'),
  n('gcp-gce-ssh', 'SSH Keys', 'Project & instance SSH access keys', 'gcp', 'security', 'Key'),
  n('gcp-gce-templates', 'Instance Templates', 'Reusable VM configuration', 'gcp', 'compute', 'FileText'),
  n('gcp-gce-nic', 'Network Interfaces', 'VPC network connections', 'gcp', 'networking', 'Network'),
  n('gcp-gce-static-ip', 'Static IPs', 'Reserved IP addresses', 'gcp', 'networking', 'MapPin'),
  n('gcp-gce-local-ssd', 'Local SSDs', 'Ephemeral high-performance storage', 'gcp', 'storage', 'HardDrive'),
  n('gcp-gce-sole-tenant', 'Sole-Tenant Nodes', 'Dedicated physical servers', 'gcp', 'compute', 'Server'),
];

export const gcpGceEdges: CloudEdge[] = [
  e('gcp-gce-images', 'gcp-gce-instances', 'Launches'),
  e('gcp-gce-templates', 'gcp-gce-mig', 'Configures'),
  e('gcp-gce-templates', 'gcp-gce-instances', 'Defines'),
  e('gcp-gce-mig', 'gcp-gce-instances', 'Manages'),
  e('gcp-gce-pd', 'gcp-gce-instances', 'Attached to'),
  e('gcp-gce-local-ssd', 'gcp-gce-instances', 'Local to'),
  e('gcp-gce-firewall', 'gcp-gce-nic', 'Applied to'),
  e('gcp-gce-nic', 'gcp-gce-instances', 'Attached to'),
  e('gcp-gce-static-ip', 'gcp-gce-nic', 'Associated with'),
  e('gcp-gce-ssh', 'gcp-gce-instances', 'SSH access'),
  e('gcp-gce-sole-tenant', 'gcp-gce-instances', 'Hosts'),
];

export const gcpGcsNodes: CloudNode[] = [
  n('gcp-gcs-buckets', 'Buckets', 'Object storage containers', 'gcp', 'storage', 'FolderOpen'),
  n('gcp-gcs-objects', 'Objects', 'Files, data, and metadata', 'gcp', 'storage', 'File'),
  n('gcp-gcs-versioning', 'Object Versioning', 'Object version history & recovery', 'gcp', 'storage', 'Copy'),
  n('gcp-gcs-lifecycle', 'Lifecycle Rules', 'Auto-transition classes & delete objects', 'gcp', 'storage', 'RefreshCw'),
  n('gcp-gcs-encryption', 'Encryption', 'Google-managed, CMEK, or CSEK keys', 'gcp', 'security', 'Lock'),
  n('gcp-gcs-iam', 'Bucket IAM', 'IAM-based access control', 'gcp', 'security', 'FileText'),
  n('gcp-gcs-classes', 'Storage Classes', 'Standard, Nearline, Coldline, Archive', 'gcp', 'storage', 'Layers'),
  n('gcp-gcs-notifications', 'Pub/Sub Notifications', 'Object change event notifications', 'gcp', 'messaging', 'Bell'),
  n('gcp-gcs-replication', 'Turbo Replication', 'Dual/multi-region replication (15 min RPO)', 'gcp', 'storage', 'Copy'),
];

export const gcpGcsEdges: CloudEdge[] = [
  e('gcp-gcs-buckets', 'gcp-gcs-objects', 'Contains'),
  e('gcp-gcs-versioning', 'gcp-gcs-objects', 'Tracks'),
  e('gcp-gcs-lifecycle', 'gcp-gcs-objects', 'Manages'),
  e('gcp-gcs-lifecycle', 'gcp-gcs-classes', 'Transitions to'),
  e('gcp-gcs-encryption', 'gcp-gcs-objects', 'Encrypts'),
  e('gcp-gcs-iam', 'gcp-gcs-buckets', 'Controls'),
  e('gcp-gcs-classes', 'gcp-gcs-objects', 'Stores'),
  e('gcp-gcs-notifications', 'gcp-gcs-objects', 'Monitors'),
  e('gcp-gcs-replication', 'gcp-gcs-buckets', 'Replicates'),
  e('gcp-gcs-replication', 'gcp-gcs-versioning', 'Requires'),
];

export const gcpCloudSqlNodes: CloudNode[] = [
  n('gcp-csql-instances', 'DB Instances', 'MySQL, PostgreSQL, or SQL Server instances', 'gcp', 'database', 'Database'),
  n('gcp-csql-replicas', 'Read Replicas', 'Cross-region & in-region read scaling', 'gcp', 'database', 'Copy'),
  n('gcp-csql-ha', 'High Availability', 'Regional HA with automatic failover', 'gcp', 'database', 'Shield'),
  n('gcp-csql-backups', 'On-demand Backups', 'Manual point-in-time snapshots', 'gcp', 'database', 'Camera'),
  n('gcp-csql-auto-backups', 'Automated Backups', 'Daily backups with PITR', 'gcp', 'database', 'RefreshCw'),
  n('gcp-csql-flags', 'Database Flags', 'Engine-level configuration parameters', 'gcp', 'database', 'Settings'),
  n('gcp-csql-private-ip', 'Private IP', 'VPC-native private connectivity', 'gcp', 'networking', 'Network'),
  n('gcp-csql-proxy', 'Cloud SQL Auth Proxy', 'Secure managed connection proxy', 'gcp', 'database', 'GitBranch'),
  n('gcp-csql-insights', 'Query Insights', 'Query performance monitoring & analysis', 'gcp', 'monitoring', 'BarChart3'),
];

export const gcpCloudSqlEdges: CloudEdge[] = [
  e('gcp-csql-instances', 'gcp-csql-replicas', 'Replicates to'),
  e('gcp-csql-ha', 'gcp-csql-instances', 'Failover'),
  e('gcp-csql-backups', 'gcp-csql-instances', 'Backs up'),
  e('gcp-csql-auto-backups', 'gcp-csql-instances', 'Continuous backup'),
  e('gcp-csql-flags', 'gcp-csql-instances', 'Configures'),
  e('gcp-csql-private-ip', 'gcp-csql-instances', 'Network'),
  e('gcp-csql-proxy', 'gcp-csql-instances', 'Pools connections'),
  e('gcp-csql-insights', 'gcp-csql-instances', 'Analyzes'),
];

export const gcpFunctionsNodes: CloudNode[] = [
  n('gcp-fn-functions', 'Functions', 'Event-driven serverless code (Gen 1 & Gen 2)', 'gcp', 'serverless', 'Zap'),
  n('gcp-fn-triggers', 'Event Triggers', 'HTTP, Pub/Sub, Cloud Storage, Firestore, Eventarc', 'gcp', 'serverless', 'ArrowDownToLine', { gatewayType: 'ingress' }),
  n('gcp-fn-build', 'Cloud Build', 'Automated build & deployment pipeline', 'gcp', 'serverless', 'Settings'),
  n('gcp-fn-retry', 'Retry Policy', 'Automatic retry on failure for event-driven functions', 'gcp', 'serverless', 'RefreshCw'),
  n('gcp-fn-concurrency', 'Concurrency', 'Max concurrent requests per instance', 'gcp', 'serverless', 'Gauge'),
  n('gcp-fn-min-instances', 'Min Instances', 'Pre-warmed instances to reduce cold starts', 'gcp', 'serverless', 'Maximize'),
  n('gcp-fn-versions', 'Versions', 'Traffic splitting across revisions (Gen 2)', 'gcp', 'serverless', 'GitBranch'),
  n('gcp-fn-env-vars', 'Environment Variables', 'Runtime configuration key-value pairs', 'gcp', 'serverless', 'Settings'),
  n('gcp-fn-vpc-connector', 'VPC Connector', 'Access VPC resources from functions', 'gcp', 'networking', 'Network'),
  n('gcp-fn-dlt', 'Dead Letter Topic', 'Failed event routing to Pub/Sub', 'gcp', 'serverless', 'Inbox'),
];

export const gcpFunctionsEdges: CloudEdge[] = [
  e('gcp-fn-triggers', 'gcp-fn-functions', 'Invokes'),
  e('gcp-fn-build', 'gcp-fn-functions', 'Deploys'),
  e('gcp-fn-retry', 'gcp-fn-functions', 'Retries'),
  e('gcp-fn-concurrency', 'gcp-fn-functions', 'Limits'),
  e('gcp-fn-min-instances', 'gcp-fn-versions', 'Pre-warms'),
  e('gcp-fn-versions', 'gcp-fn-functions', 'Revision of'),
  e('gcp-fn-env-vars', 'gcp-fn-functions', 'Configures'),
  e('gcp-fn-vpc-connector', 'gcp-fn-functions', 'Connects'),
  e('gcp-fn-functions', 'gcp-fn-dlt', 'Failed events'),
];

export const gcpMonitoringNodes: CloudNode[] = [
  n('gcp-mon-metrics', 'Metrics', 'Time-series resource & custom metrics', 'gcp', 'monitoring', 'BarChart3'),
  n('gcp-mon-alerts', 'Alerting Policies', 'Threshold & absence-based alerts with channels', 'gcp', 'monitoring', 'Bell'),
  n('gcp-mon-uptime', 'Uptime Checks', 'HTTP/TCP endpoint availability monitoring', 'gcp', 'monitoring', 'HeartPulse'),
  n('gcp-mon-logging', 'Cloud Logging', 'Centralized log collection & storage', 'gcp', 'monitoring', 'FileText'),
  n('gcp-mon-log-analytics', 'Log Analytics', 'BigQuery-powered log analysis', 'gcp', 'monitoring', 'Search'),
  n('gcp-mon-dashboards', 'Dashboards', 'Custom metric & log visualization', 'gcp', 'monitoring', 'LayoutDashboard'),
  n('gcp-mon-slo', 'Service Monitoring', 'SLO/SLI tracking for services', 'gcp', 'monitoring', 'Activity'),
  n('gcp-mon-gke', 'GKE Monitoring', 'Kubernetes-specific observability', 'gcp', 'monitoring', 'Box'),
  n('gcp-mon-synthetics', 'Synthetic Monitors', 'Scripted availability checks', 'gcp', 'monitoring', 'Globe'),
];

export const gcpMonitoringEdges: CloudEdge[] = [
  e('gcp-mon-metrics', 'gcp-mon-alerts', 'Triggers'),
  e('gcp-mon-metrics', 'gcp-mon-dashboards', 'Displayed on'),
  e('gcp-mon-metrics', 'gcp-mon-slo', 'Tracks'),
  e('gcp-mon-uptime', 'gcp-mon-alerts', 'Triggers'),
  e('gcp-mon-logging', 'gcp-mon-metrics', 'Filters to'),
  e('gcp-mon-logging', 'gcp-mon-log-analytics', 'Queried by'),
  e('gcp-mon-logging', 'gcp-mon-dashboards', 'Displayed on'),
  e('gcp-mon-gke', 'gcp-mon-metrics', 'Publishes'),
  e('gcp-mon-gke', 'gcp-mon-logging', 'Publishes'),
  e('gcp-mon-synthetics', 'gcp-mon-metrics', 'Publishes'),
  e('gcp-mon-synthetics', 'gcp-mon-alerts', 'Triggers'),
  e('gcp-mon-alerts', 'gcp-mon-uptime', 'Triggered by'),
];

export const gcpDnsNodes: CloudNode[] = [
  n('gcp-dns-zones', 'Managed Zones', 'Public & private DNS zone containers', 'gcp', 'networking', 'FolderOpen'),
  n('gcp-dns-records', 'Record Sets', 'A, AAAA, CNAME, MX, SRV records', 'gcp', 'networking', 'FileText'),
  n('gcp-dns-health', 'Health Checks', 'Endpoint health for routing decisions', 'gcp', 'monitoring', 'HeartPulse'),
  n('gcp-dns-routing', 'Routing Policies', 'Weighted, geolocation, failover routing', 'gcp', 'networking', 'GitBranch'),
  n('gcp-dns-peering', 'DNS Peering', 'Cross-VPC DNS resolution', 'gcp', 'networking', 'Link'),
  n('gcp-dns-dnssec', 'DNSSEC', 'DNS response authentication', 'gcp', 'security', 'ShieldCheck'),
];

export const gcpDnsEdges: CloudEdge[] = [
  e('gcp-dns-zones', 'gcp-dns-records', 'Contains'),
  e('gcp-dns-health', 'gcp-dns-records', 'Monitors'),
  e('gcp-dns-routing', 'gcp-dns-records', 'Applied to'),
  e('gcp-dns-peering', 'gcp-dns-zones', 'Resolves'),
  e('gcp-dns-dnssec', 'gcp-dns-zones', 'Protects'),
];

export const gcpLbNodes: CloudNode[] = [
  n('gcp-lb-http', 'HTTP(S) LB', 'Global Layer 7 load balancing', 'gcp', 'networking', 'Globe'),
  n('gcp-lb-tcp', 'TCP/SSL Proxy LB', 'Global Layer 4 proxy load balancing', 'gcp', 'networking', 'Zap'),
  n('gcp-lb-network', 'Network LB', 'Regional pass-through Layer 4', 'gcp', 'networking', 'Network'),
  n('gcp-lb-backend', 'Backend Services', 'Instance groups, NEGs, or serverless backends', 'gcp', 'networking', 'Users'),
  n('gcp-lb-urlmap', 'URL Maps', 'Path & host-based routing rules', 'gcp', 'networking', 'GitBranch'),
  n('gcp-lb-health', 'Health Checks', 'Backend health monitoring', 'gcp', 'monitoring', 'HeartPulse'),
  n('gcp-lb-ssl', 'SSL Certificates', 'Managed & self-managed TLS certificates', 'gcp', 'security', 'Lock'),
];

export const gcpLbEdges: CloudEdge[] = [
  e('gcp-lb-http', 'gcp-lb-urlmap', 'Uses'),
  e('gcp-lb-tcp', 'gcp-lb-backend', 'Routes to'),
  e('gcp-lb-network', 'gcp-lb-backend', 'Routes to'),
  e('gcp-lb-urlmap', 'gcp-lb-backend', 'Routes to'),
  e('gcp-lb-http', 'gcp-lb-ssl', 'Terminates TLS'),
  e('gcp-lb-health', 'gcp-lb-backend', 'Monitors'),
  e('gcp-lb-ssl', 'gcp-lb-http', 'Secures'),
];

export const gcpPubsubNodes: CloudNode[] = [
  n('gcp-ps-topics', 'Topics', 'Named message channels', 'gcp', 'messaging', 'Bell'),
  n('gcp-ps-subs', 'Subscriptions', 'Push, pull, or BigQuery delivery', 'gcp', 'messaging', 'Users'),
  n('gcp-ps-dlq', 'Dead Letter Topics', 'Failed message handling after retries', 'gcp', 'messaging', 'AlertCircle'),
  n('gcp-ps-ordering', 'Message Ordering', 'Ordered delivery within ordering key', 'gcp', 'messaging', 'Clock'),
  n('gcp-ps-schemas', 'Schemas', 'Avro/Protobuf message validation', 'gcp', 'messaging', 'FileText'),
  n('gcp-ps-snapshots', 'Snapshots', 'Subscription state capture for replay', 'gcp', 'messaging', 'Camera'),
];

export const gcpPubsubEdges: CloudEdge[] = [
  e('gcp-ps-topics', 'gcp-ps-subs', 'Delivers to'),
  e('gcp-ps-subs', 'gcp-ps-dlq', 'Failed messages'),
  e('gcp-ps-ordering', 'gcp-ps-topics', 'Applied to'),
  e('gcp-ps-schemas', 'gcp-ps-topics', 'Validates'),
  e('gcp-ps-snapshots', 'gcp-ps-subs', 'Captures'),
  e('gcp-ps-ordering', 'gcp-ps-subs', 'Controls'),
];

export const gcpBigQueryNodes: CloudNode[] = [
  n('gcp-bq-datasets', 'Datasets', 'Containers for tables and views', 'gcp', 'analytics', 'FolderOpen'),
  n('gcp-bq-tables', 'Tables', 'Native & external data tables', 'gcp', 'analytics', 'Database'),
  n('gcp-bq-views', 'Views', 'Logical views & authorized views', 'gcp', 'analytics', 'Search'),
  n('gcp-bq-mv', 'Materialized Views', 'Pre-computed query results', 'gcp', 'analytics', 'Layers'),
  n('gcp-bq-scheduled', 'Scheduled Queries', 'Recurring SQL transformations', 'gcp', 'analytics', 'Clock'),
  n('gcp-bq-reservations', 'Reservations', 'Dedicated slot capacity management', 'gcp', 'analytics', 'Gauge'),
  n('gcp-bq-streaming', 'Streaming', 'Real-time data ingestion', 'gcp', 'analytics', 'Activity'),
];

export const gcpBigQueryEdges: CloudEdge[] = [
  e('gcp-bq-datasets', 'gcp-bq-tables', 'Contains'),
  e('gcp-bq-datasets', 'gcp-bq-views', 'Contains'),
  e('gcp-bq-views', 'gcp-bq-tables', 'Queries'),
  e('gcp-bq-mv', 'gcp-bq-tables', 'Aggregates'),
  e('gcp-bq-scheduled', 'gcp-bq-tables', 'Writes to'),
  e('gcp-bq-streaming', 'gcp-bq-tables', 'Inserts into'),
  e('gcp-bq-reservations', 'gcp-bq-datasets', 'Allocates capacity'),
];

// ═══════════════════════════════════════════════════════════════════════
// Azure — Service categories
// ═══════════════════════════════════════════════════════════════════════
export const azureNodes: CloudNode[] = [
  n('az-vnet', 'Virtual Network', 'VNet – isolated network', 'azure', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('az-ad', 'Entra ID', 'Identity & Access (formerly Azure AD)', 'azure', 'security', 'Shield', { isGroup: true, hasChildren: true }),
  n('az-aks', 'AKS', 'Azure Kubernetes Service', 'azure', 'kubernetes', 'Box', { isGroup: true, hasChildren: true }),
  n('az-vm', 'Virtual Machines', 'Azure VMs', 'azure', 'compute', 'Server', { isGroup: true, hasChildren: true }),
  n('az-blob', 'Blob Storage', 'Object Storage', 'azure', 'storage', 'HardDrive', { isGroup: true, hasChildren: true }),
  n('az-sql', 'Azure SQL', 'Managed SQL Database', 'azure', 'database', 'Database', { isGroup: true, hasChildren: true }),
  n('az-functions', 'Azure Functions', 'Serverless Compute', 'azure', 'serverless', 'Zap', { isGroup: true, hasChildren: true }),
  n('az-monitor', 'Azure Monitor', 'Monitoring & Diagnostics', 'azure', 'monitoring', 'Activity', { isGroup: true, hasChildren: true }),
  n('az-dns', 'Azure DNS', 'DNS Service', 'azure', 'networking', 'Globe', { isGroup: true, hasChildren: true, gatewayType: 'ingress' }),
  n('az-lb', 'Load Balancer', 'Azure Load Balancer', 'azure', 'networking', 'GitBranch', { isGroup: true, hasChildren: true, gatewayType: 'ingress' }),
  n('az-servicebus', 'Service Bus', 'Messaging Service', 'azure', 'messaging', 'Inbox', { isGroup: true, hasChildren: true }),
  n('az-cosmos', 'Cosmos DB', 'Multi-model NoSQL', 'azure', 'database', 'Database', { isGroup: true, hasChildren: true }),
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
  e('az-blob', 'az-functions', 'Triggers'),
  e('az-functions', 'az-servicebus', 'Subscribe'),
  e('az-functions', 'az-sql', 'Query'),
  e('az-monitor', 'az-vm', 'Monitors'),
  e('az-monitor', 'az-aks', 'Monitors'),
  e('az-monitor', 'az-functions', 'Monitors'),
  e('az-functions', 'az-vnet', 'VNet Integration'),
  e('az-cosmos', 'az-vnet', 'Private Endpoint'),
  e('az-vm', 'az-ad', 'Auth'),
  e('az-functions', 'az-ad', 'Auth'),
  e('az-monitor', 'az-sql', 'Monitors'),
  e('az-monitor', 'az-blob', 'Monitors'),
  e('az-monitor', 'az-lb', 'Monitors'),
  e('az-lb', 'az-functions', 'Traffic'),
];

// ─── AKS internals ────────────────────────────────────────────────────
export const aksNodes: CloudNode[] = [
  n('aks-control-plane', 'Control Plane', 'Managed by Azure', 'azure', 'control-plane', 'Cpu', { isGroup: true, hasChildren: true }),
  n('aks-node-pools', 'Node Pools', 'VMSS-backed worker nodes', 'azure', 'worker-node', 'Server', { isGroup: true, hasChildren: true }),
  n('aks-networking', 'Cluster Networking', 'Azure CNI / Kubenet', 'azure', 'networking', 'Network', { isGroup: true, hasChildren: true }),
  n('aks-virtual-nodes', 'Virtual Nodes', 'Serverless pods via ACI (no VM management)', 'azure', 'serverless', 'Cloud'),
  n('aks-addons', 'AKS Add-ons', 'Managed cluster extensions (monitoring, policy, etc.)', 'azure', 'kubernetes', 'Layers'),
  n('aks-workload-identity', 'Workload Identity', 'Pod-level Entra ID credentials', 'azure', 'security', 'Key'),
];

export const aksEdges: CloudEdge[] = [
  e('aks-control-plane', 'aks-node-pools', 'Manages'),
  e('aks-networking', 'aks-node-pools', 'Connects'),
  e('aks-networking', 'aks-control-plane', 'Connects'),
  e('aks-addons', 'aks-networking', 'Provides'),
  e('aks-workload-identity', 'aks-node-pools', 'Credentials'),
  e('aks-control-plane', 'aks-virtual-nodes', 'Manages'),
  e('aks-networking', 'aks-virtual-nodes', 'Connects'),
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
  n('aks-np-pods', 'Pods', 'Application workloads', 'azure', 'worker-node', 'Layers', { isGroup: true, hasChildren: true }),
];

export const aksNodePoolEdges: CloudEdge[] = [
  e('aks-np-kubelet', 'aks-np-runtime', 'Manages'),
  e('aks-np-runtime', 'aks-np-pods', 'Runs'),
  e('aks-np-proxy', 'aks-np-pods', 'Routes to'),
];

export const aksNetworkingNodes: CloudNode[] = [
  n('aks-net-cni', 'Azure CNI', 'Pod networking (Overlay or VNet IPs)', 'azure', 'networking', 'Network'),
  n('aks-net-dns', 'CoreDNS', 'Cluster DNS', 'azure', 'networking', 'Globe'),
  n('aks-net-ingress', 'AGIC', 'Application Gateway Ingress', 'azure', 'networking', 'ArrowDownToLine', { gatewayType: 'ingress' }),
  n('aks-net-services', 'Services', 'ClusterIP, NodePort, LoadBalancer', 'azure', 'networking', 'GitBranch'),
  n('aks-net-network-policy', 'Network Policies', 'Pod-to-pod traffic rules (Calico/Azure NPM)', 'azure', 'security', 'Shield'),
];

export const aksNetworkingEdges: CloudEdge[] = [
  e('aks-net-ingress', 'aks-net-services', 'Routes to'),
  e('aks-net-services', 'aks-net-dns', 'Resolves via'),
  e('aks-net-cni', 'aks-net-services', 'Provides IPs'),
  e('aks-net-network-policy', 'aks-net-services', 'Filters'),
];

// ─── AKS Pod internals ──────────────────────────────────────────────
export const aksPodNodes: CloudNode[] = [
  n('aks-pod-containers', 'Containers', 'Application containers', 'azure', 'containers', 'Box'),
  n('aks-pod-init-containers', 'Init Containers', 'Run before app containers', 'azure', 'containers', 'PlayCircle'),
  n('aks-pod-volumes', 'Volumes', 'Shared storage within pod', 'azure', 'storage', 'HardDrive'),
  n('aks-pod-secrets', 'Secrets', 'Sensitive data (mounted or env)', 'azure', 'security', 'Lock'),
  n('aks-pod-configmaps', 'ConfigMaps', 'Configuration data', 'azure', 'storage', 'FileText'),
  n('aks-pod-service-account', 'Service Account', 'Pod identity for RBAC', 'azure', 'security', 'User'),
  n('aks-pod-probes', 'Health Probes', 'Liveness, Readiness, Startup', 'azure', 'monitoring', 'HeartPulse'),
  n('aks-pod-resources', 'Resource Limits', 'CPU & memory requests/limits', 'azure', 'compute', 'Gauge'),
];

export const aksPodEdges: CloudEdge[] = [
  e('aks-pod-init-containers', 'aks-pod-containers', 'Run before'),
  e('aks-pod-containers', 'aks-pod-volumes', 'Mount'),
  e('aks-pod-containers', 'aks-pod-secrets', 'Mount/Env'),
  e('aks-pod-containers', 'aks-pod-configmaps', 'Mount/Env'),
  e('aks-pod-containers', 'aks-pod-service-account', 'Identity'),
  e('aks-pod-probes', 'aks-pod-containers', 'Checks'),
  e('aks-pod-resources', 'aks-pod-containers', 'Constrains'),
];

// ═══════════════════════════════════════════════════════════════════════
// Azure sub-service details
// ═══════════════════════════════════════════════════════════════════════
export const azVnetNodes: CloudNode[] = [
  n('az-vnet-subnets', 'Subnets', 'IP address ranges within a VNet', 'azure', 'networking', 'Layers'),
  n('az-vnet-nsg', 'Network Security Groups', 'Stateful allow/deny security rules', 'azure', 'security', 'Shield'),
  n('az-vnet-nat', 'NAT Gateway', 'Outbound internet for private subnets', 'azure', 'networking', 'ArrowUpRight', { gatewayType: 'egress' }),
  n('az-vnet-rt', 'Route Tables', 'User-defined routing rules (UDRs)', 'azure', 'networking', 'GitBranch'),
  n('az-vnet-peering', 'VNet Peering', 'Non-transitive VNet-to-VNet connectivity', 'azure', 'networking', 'Link', { gatewayType: 'both' }),
  n('az-vnet-private-ep', 'Private Endpoints', 'Private connectivity to Azure services', 'azure', 'networking', 'Link', { gatewayType: 'egress' }),
  n('az-vnet-service-ep', 'Service Endpoints', 'Optimized routing to Azure services', 'azure', 'networking', 'Link'),
  n('az-vnet-pip', 'Public IPs', 'Static or dynamic public IP addresses', 'azure', 'networking', 'MapPin'),
  n('az-vnet-firewall', 'Azure Firewall', 'Managed network security appliance', 'azure', 'security', 'ShieldCheck'),
  n('az-vnet-vng', 'Virtual Network Gateway', 'VPN & ExpressRoute gateway', 'azure', 'networking', 'ArrowLeftRight', { gatewayType: 'both' }),
  n('az-vnet-ddos', 'DDoS Protection', 'Distributed denial-of-service protection', 'azure', 'security', 'Shield'),
  n('az-vnet-nic', 'Network Interfaces', 'Virtual NICs for VMs and services', 'azure', 'networking', 'Network'),
];

export const azVnetEdges: CloudEdge[] = [
  e('az-vnet-nsg', 'az-vnet-nic', 'Attached to'),
  e('az-vnet-nic', 'az-vnet-subnets', 'Attached in'),
  e('az-vnet-nat', 'az-vnet-subnets', 'Outbound from'),
  e('az-vnet-rt', 'az-vnet-subnets', 'Routes'),
  e('az-vnet-peering', 'az-vnet-rt', 'Via routes'),
  e('az-vnet-firewall', 'az-vnet-subnets', 'Protects'),
  e('az-vnet-private-ep', 'az-vnet-subnets', 'Endpoint in'),
  e('az-vnet-service-ep', 'az-vnet-subnets', 'Optimizes'),
  e('az-vnet-pip', 'az-vnet-nat', 'Assigned to'),
  e('az-vnet-pip', 'az-vnet-nic', 'Associated with'),
  e('az-vnet-vng', 'az-vnet-subnets', 'Connects'),
  e('az-vnet-ddos', 'az-vnet-subnets', 'Protects'),
  e('az-vnet-nsg', 'az-vnet-subnets', 'Applied to'),
];

export const azEntraNodes: CloudNode[] = [
  n('az-ad-users', 'Users', 'Cloud & synced user identities', 'azure', 'security', 'User'),
  n('az-ad-groups', 'Groups', 'Security & Microsoft 365 groups', 'azure', 'security', 'Users'),
  n('az-ad-app-reg', 'App Registrations', 'Application identity definitions', 'azure', 'security', 'FileText'),
  n('az-ad-sp', 'Service Principals', 'Application instances in tenant', 'azure', 'security', 'Key'),
  n('az-ad-mi', 'Managed Identities', 'System & user-assigned Azure identities', 'azure', 'security', 'UserCheck'),
  n('az-ad-ca', 'Conditional Access', 'Policy-based access controls (location, risk, device)', 'azure', 'security', 'Filter'),
  n('az-ad-rbac', 'RBAC Roles', 'Role-based access control assignments', 'azure', 'security', 'ShieldCheck'),
  n('az-ad-pim', 'PIM', 'Privileged Identity Management – just-in-time access', 'azure', 'security', 'Shield'),
  n('az-ad-enterprise', 'Enterprise Applications', 'SSO & provisioning for SaaS apps', 'azure', 'security', 'Globe'),
  n('az-ad-mfa', 'Multi-Factor Auth', 'Additional authentication factors', 'azure', 'security', 'Lock'),
];

export const azEntraEdges: CloudEdge[] = [
  e('az-ad-users', 'az-ad-groups', 'Belong to'),
  e('az-ad-rbac', 'az-ad-users', 'Assigned to'),
  e('az-ad-rbac', 'az-ad-groups', 'Assigned to'),
  e('az-ad-rbac', 'az-ad-sp', 'Assigned to'),
  e('az-ad-rbac', 'az-ad-mi', 'Assigned to'),
  e('az-ad-app-reg', 'az-ad-sp', 'Creates'),
  e('az-ad-mfa', 'az-ad-users', 'Protects'),
  e('az-ad-ca', 'az-ad-users', 'Evaluates'),
  e('az-ad-ca', 'az-ad-groups', 'Evaluates'),
  e('az-ad-pim', 'az-ad-rbac', 'Governs'),
  e('az-ad-enterprise', 'az-ad-sp', 'Provisions'),
  e('az-ad-mi', 'az-ad-sp', 'Type of'),
];

export const azVmNodes: CloudNode[] = [
  n('az-vm-instances', 'VMs', 'Virtual machine instances', 'azure', 'compute', 'Server'),
  n('az-vm-images', 'VM Images', 'Marketplace & custom images', 'azure', 'compute', 'Image'),
  n('az-vm-vmss', 'VM Scale Sets', 'Autoscaling VM groups (uniform/flexible)', 'azure', 'compute', 'Maximize'),
  n('az-vm-disks', 'Managed Disks', 'Persistent block storage (Premium/Standard SSD, HDD)', 'azure', 'storage', 'HardDrive'),
  n('az-vm-nsg', 'NSGs', 'Instance-level network security groups', 'azure', 'security', 'Shield'),
  n('az-vm-ssh', 'SSH Keys', 'Azure-managed SSH key pairs', 'azure', 'security', 'Key'),
  n('az-vm-templates', 'ARM/Bicep Templates', 'Infrastructure-as-code VM definitions', 'azure', 'compute', 'FileText'),
  n('az-vm-nic', 'NICs', 'Network interfaces for connectivity', 'azure', 'networking', 'Network'),
  n('az-vm-pip', 'Public IPs', 'Public IP addresses for VMs', 'azure', 'networking', 'MapPin'),
  n('az-vm-temp-disk', 'Temporary Disk', 'Ephemeral local storage (non-persistent)', 'azure', 'storage', 'HardDrive'),
  n('az-vm-ppg', 'Proximity Placement Groups', 'Co-located VM placement for low latency', 'azure', 'compute', 'LayoutDashboard'),
];

export const azVmEdges: CloudEdge[] = [
  e('az-vm-images', 'az-vm-instances', 'Launches'),
  e('az-vm-templates', 'az-vm-vmss', 'Configures'),
  e('az-vm-templates', 'az-vm-instances', 'Defines'),
  e('az-vm-vmss', 'az-vm-instances', 'Manages'),
  e('az-vm-disks', 'az-vm-instances', 'Attached to'),
  e('az-vm-temp-disk', 'az-vm-instances', 'Local to'),
  e('az-vm-nsg', 'az-vm-nic', 'Attached to'),
  e('az-vm-nic', 'az-vm-instances', 'Attached to'),
  e('az-vm-pip', 'az-vm-nic', 'Associated with'),
  e('az-vm-ssh', 'az-vm-instances', 'SSH access'),
  e('az-vm-ppg', 'az-vm-instances', 'Places'),
];

export const azBlobNodes: CloudNode[] = [
  n('az-blob-containers', 'Containers', 'Blob storage containers', 'azure', 'storage', 'FolderOpen'),
  n('az-blob-blobs', 'Blobs', 'Block, append, and page blobs', 'azure', 'storage', 'File'),
  n('az-blob-versioning', 'Versioning', 'Blob version history & recovery', 'azure', 'storage', 'Copy'),
  n('az-blob-lifecycle', 'Lifecycle Management', 'Auto-tier and delete based on rules', 'azure', 'storage', 'RefreshCw'),
  n('az-blob-encryption', 'Encryption', 'Microsoft-managed or customer-managed keys', 'azure', 'security', 'Lock'),
  n('az-blob-access', 'Access Policies & SAS', 'Shared access signatures & stored policies', 'azure', 'security', 'FileText'),
  n('az-blob-tiers', 'Access Tiers', 'Hot, Cool, Cold, and Archive tiers', 'azure', 'storage', 'Layers'),
  n('az-blob-events', 'Event Grid Notifications', 'Blob create/delete event triggers', 'azure', 'messaging', 'Bell'),
  n('az-blob-replication', 'Object Replication', 'Async cross-account/cross-region replication', 'azure', 'storage', 'Copy'),
];

export const azBlobEdges: CloudEdge[] = [
  e('az-blob-containers', 'az-blob-blobs', 'Contains'),
  e('az-blob-versioning', 'az-blob-blobs', 'Tracks'),
  e('az-blob-lifecycle', 'az-blob-blobs', 'Manages'),
  e('az-blob-lifecycle', 'az-blob-tiers', 'Transitions to'),
  e('az-blob-encryption', 'az-blob-blobs', 'Encrypts'),
  e('az-blob-access', 'az-blob-containers', 'Controls'),
  e('az-blob-tiers', 'az-blob-blobs', 'Stores'),
  e('az-blob-events', 'az-blob-blobs', 'Monitors'),
  e('az-blob-replication', 'az-blob-containers', 'Replicates'),
  e('az-blob-replication', 'az-blob-versioning', 'Requires'),
];

export const azSqlNodes: CloudNode[] = [
  n('az-sql-databases', 'Databases', 'Single databases on logical servers', 'azure', 'database', 'Database'),
  n('az-sql-geo-rep', 'Geo-Replication', 'Active geo-replication for read scaling', 'azure', 'database', 'Copy'),
  n('az-sql-failover', 'Failover Groups', 'Automatic regional failover with DNS', 'azure', 'database', 'Shield'),
  n('az-sql-pitr', 'Point-in-Time Restore', 'Continuous backups with PITR (7-35 days)', 'azure', 'database', 'Camera'),
  n('az-sql-ltr', 'Long-Term Retention', 'Weekly/monthly/yearly backup retention', 'azure', 'database', 'RefreshCw'),
  n('az-sql-config', 'Server Configuration', 'Server-level settings & firewall rules', 'azure', 'database', 'Settings'),
  n('az-sql-vnet', 'VNet Rules & Private Link', 'Private network access', 'azure', 'networking', 'Network'),
  n('az-sql-elastic', 'Elastic Pools', 'Shared DTU/vCore resource pools', 'azure', 'database', 'Layers'),
  n('az-sql-qpi', 'Query Performance Insights', 'Query-level performance analytics', 'azure', 'monitoring', 'BarChart3'),
];

export const azSqlEdges: CloudEdge[] = [
  e('az-sql-databases', 'az-sql-geo-rep', 'Replicates to'),
  e('az-sql-failover', 'az-sql-databases', 'Failover'),
  e('az-sql-pitr', 'az-sql-databases', 'Backs up'),
  e('az-sql-ltr', 'az-sql-databases', 'Retains'),
  e('az-sql-config', 'az-sql-databases', 'Configures'),
  e('az-sql-vnet', 'az-sql-databases', 'Network'),
  e('az-sql-elastic', 'az-sql-databases', 'Pools resources'),
  e('az-sql-qpi', 'az-sql-databases', 'Analyzes'),
];

export const azFunctionsNodes: CloudNode[] = [
  n('az-fn-functions', 'Functions', 'Event-driven serverless code', 'azure', 'serverless', 'Zap'),
  n('az-fn-triggers', 'Triggers & Bindings', 'Input/output bindings for 20+ services', 'azure', 'serverless', 'ArrowDownToLine', { gatewayType: 'ingress' }),
  n('az-fn-slots', 'Deployment Slots', 'Staging environments with swap capability', 'azure', 'serverless', 'Layers'),
  n('az-fn-durable', 'Durable Functions', 'Stateful orchestration patterns', 'azure', 'serverless', 'GitBranch'),
  n('az-fn-plan', 'Hosting Plans', 'Consumption, Premium, or Dedicated plans', 'azure', 'serverless', 'Gauge'),
  n('az-fn-settings', 'App Settings', 'Runtime configuration & connection strings', 'azure', 'serverless', 'Settings'),
  n('az-fn-vnet', 'VNet Integration', 'Private network resource access', 'azure', 'networking', 'Network'),
  n('az-fn-env-vars', 'Environment Variables', 'Key-value runtime configuration', 'azure', 'serverless', 'Settings'),
  n('az-fn-dlq', 'Dead Letter Queue', 'Failed message routing (via Service Bus/Storage)', 'azure', 'serverless', 'Inbox'),
];

export const azFunctionsEdges: CloudEdge[] = [
  e('az-fn-triggers', 'az-fn-functions', 'Invokes'),
  e('az-fn-slots', 'az-fn-functions', 'Deploys to'),
  e('az-fn-durable', 'az-fn-functions', 'Orchestrates'),
  e('az-fn-plan', 'az-fn-functions', 'Hosts'),
  e('az-fn-settings', 'az-fn-functions', 'Configures'),
  e('az-fn-env-vars', 'az-fn-functions', 'Configures'),
  e('az-fn-vnet', 'az-fn-functions', 'Connects'),
  e('az-fn-functions', 'az-fn-dlq', 'Failed events'),
  e('az-fn-durable', 'az-fn-triggers', 'Triggers'),
];

export const azMonitorNodes: CloudNode[] = [
  n('az-mon-metrics', 'Metrics', 'Platform & custom metrics at 1-min granularity', 'azure', 'monitoring', 'BarChart3'),
  n('az-mon-alerts', 'Alerts', 'Metric, log, and activity log alert rules', 'azure', 'monitoring', 'Bell'),
  n('az-mon-action-groups', 'Action Groups', 'Notification & automation targets', 'azure', 'monitoring', 'Users'),
  n('az-mon-log-analytics', 'Log Analytics', 'Centralized log workspace (KQL queries)', 'azure', 'monitoring', 'Search'),
  n('az-mon-kql', 'KQL Queries', 'Kusto Query Language for log analysis', 'azure', 'monitoring', 'FileText'),
  n('az-mon-dashboards', 'Dashboards', 'Azure Portal metric & log dashboards', 'azure', 'monitoring', 'LayoutDashboard'),
  n('az-mon-app-insights', 'Application Insights', 'Application performance monitoring (APM)', 'azure', 'monitoring', 'Activity'),
  n('az-mon-container', 'Container Insights', 'AKS & container monitoring', 'azure', 'monitoring', 'Box'),
  n('az-mon-avail', 'Availability Tests', 'URL ping & multi-step web tests', 'azure', 'monitoring', 'Globe'),
];

export const azMonitorEdges: CloudEdge[] = [
  e('az-mon-metrics', 'az-mon-alerts', 'Triggers'),
  e('az-mon-metrics', 'az-mon-dashboards', 'Displayed on'),
  e('az-mon-alerts', 'az-mon-action-groups', 'Notifies'),
  e('az-mon-log-analytics', 'az-mon-kql', 'Queried by'),
  e('az-mon-log-analytics', 'az-mon-dashboards', 'Displayed on'),
  e('az-mon-log-analytics', 'az-mon-alerts', 'Triggers'),
  e('az-mon-app-insights', 'az-mon-metrics', 'Publishes'),
  e('az-mon-app-insights', 'az-mon-log-analytics', 'Streams to'),
  e('az-mon-container', 'az-mon-metrics', 'Publishes'),
  e('az-mon-container', 'az-mon-log-analytics', 'Publishes'),
  e('az-mon-avail', 'az-mon-metrics', 'Publishes'),
  e('az-mon-avail', 'az-mon-alerts', 'Triggers'),
];

export const azDnsNodes: CloudNode[] = [
  n('az-dns-zones', 'DNS Zones', 'Public DNS zone containers', 'azure', 'networking', 'FolderOpen'),
  n('az-dns-records', 'Record Sets', 'A, AAAA, CNAME, MX, SRV, TXT records', 'azure', 'networking', 'FileText'),
  n('az-dns-private', 'Private DNS Zones', 'VNet-scoped private name resolution', 'azure', 'networking', 'Lock'),
  n('az-dns-tm', 'Traffic Manager', 'DNS-based global traffic routing', 'azure', 'networking', 'GitBranch'),
  n('az-dns-health', 'Health Probes', 'Endpoint health monitoring for routing', 'azure', 'monitoring', 'HeartPulse'),
  n('az-dns-frontdoor', 'Azure Front Door', 'Global CDN & load balancing entry point', 'azure', 'networking', 'Globe'),
];

export const azDnsEdges: CloudEdge[] = [
  e('az-dns-zones', 'az-dns-records', 'Contains'),
  e('az-dns-private', 'az-dns-records', 'Contains'),
  e('az-dns-tm', 'az-dns-health', 'Uses'),
  e('az-dns-tm', 'az-dns-zones', 'Routes via'),
  e('az-dns-frontdoor', 'az-dns-zones', 'Routes via'),
];

export const azLbNodes: CloudNode[] = [
  n('az-lb-standard', 'Standard LB', 'Regional Layer 4 TCP/UDP load balancer', 'azure', 'networking', 'Network'),
  n('az-lb-appgw', 'Application Gateway', 'Regional Layer 7 HTTP/HTTPS load balancer', 'azure', 'networking', 'Globe'),
  n('az-lb-frontdoor', 'Front Door', 'Global Layer 7 with CDN & WAF', 'azure', 'networking', 'Globe'),
  n('az-lb-backend', 'Backend Pools', 'VM, VMSS, or IP backend targets', 'azure', 'networking', 'Users'),
  n('az-lb-probes', 'Health Probes', 'Backend health monitoring (HTTP/TCP)', 'azure', 'monitoring', 'HeartPulse'),
  n('az-lb-rules', 'Load Balancing Rules', 'Traffic distribution rules', 'azure', 'networking', 'GitBranch'),
  n('az-lb-waf', 'WAF Policies', 'Web Application Firewall rule sets', 'azure', 'security', 'ShieldCheck'),
];

export const azLbEdges: CloudEdge[] = [
  e('az-lb-standard', 'az-lb-rules', 'Uses'),
  e('az-lb-appgw', 'az-lb-rules', 'Uses'),
  e('az-lb-frontdoor', 'az-lb-rules', 'Uses'),
  e('az-lb-rules', 'az-lb-backend', 'Routes to'),
  e('az-lb-probes', 'az-lb-backend', 'Monitors'),
  e('az-lb-waf', 'az-lb-appgw', 'Protects'),
  e('az-lb-waf', 'az-lb-frontdoor', 'Protects'),
];

export const azServiceBusNodes: CloudNode[] = [
  n('az-sb-queues', 'Queues', 'Point-to-point FIFO message delivery', 'azure', 'messaging', 'Inbox'),
  n('az-sb-topics', 'Topics', 'Publish-subscribe message distribution', 'azure', 'messaging', 'Bell'),
  n('az-sb-subs', 'Subscriptions', 'Filtered topic consumers', 'azure', 'messaging', 'Users'),
  n('az-sb-dlq', 'Dead Letter Queues', 'Failed/expired message storage', 'azure', 'messaging', 'AlertCircle'),
  n('az-sb-sessions', 'Message Sessions', 'Ordered processing with session affinity', 'azure', 'messaging', 'Clock'),
  n('az-sb-forward', 'Auto-Forwarding', 'Automatic message chaining between entities', 'azure', 'messaging', 'ArrowUpRight'),
];

export const azServiceBusEdges: CloudEdge[] = [
  e('az-sb-topics', 'az-sb-subs', 'Delivers to'),
  e('az-sb-queues', 'az-sb-dlq', 'Failed messages'),
  e('az-sb-subs', 'az-sb-dlq', 'Failed messages'),
  e('az-sb-sessions', 'az-sb-queues', 'Orders'),
  e('az-sb-sessions', 'az-sb-subs', 'Orders'),
  e('az-sb-forward', 'az-sb-queues', 'Chains to'),
];

export const azCosmosNodes: CloudNode[] = [
  n('az-cosmos-databases', 'Databases', 'Logical containers for data organization', 'azure', 'database', 'Database'),
  n('az-cosmos-containers', 'Containers', 'Schema-agnostic item collections', 'azure', 'database', 'FolderOpen'),
  n('az-cosmos-consistency', 'Consistency Levels', 'Strong, Bounded, Session, Prefix, Eventual', 'azure', 'database', 'Settings'),
  n('az-cosmos-partitioning', 'Partitioning', 'Logical & physical partition management', 'azure', 'database', 'Layers'),
  n('az-cosmos-change-feed', 'Change Feed', 'Real-time item change stream', 'azure', 'database', 'Activity'),
  n('az-cosmos-sprocs', 'Stored Procedures', 'Server-side JavaScript execution', 'azure', 'database', 'Zap'),
  n('az-cosmos-global', 'Global Distribution', 'Multi-region read/write replication', 'azure', 'database', 'Globe'),
];

export const azCosmosEdges: CloudEdge[] = [
  e('az-cosmos-databases', 'az-cosmos-containers', 'Contains'),
  e('az-cosmos-consistency', 'az-cosmos-containers', 'Applied to'),
  e('az-cosmos-partitioning', 'az-cosmos-containers', 'Distributes'),
  e('az-cosmos-change-feed', 'az-cosmos-containers', 'Streams from'),
  e('az-cosmos-sprocs', 'az-cosmos-containers', 'Executes in'),
  e('az-cosmos-global', 'az-cosmos-databases', 'Replicates'),
  e('az-cosmos-global', 'az-cosmos-consistency', 'Governed by'),
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
  'gcp-vpc': { label: 'VPC Network', description: 'Global virtual network', nodes: gcpVpcNodes, edges: gcpVpcEdges },
  'gcp-iam': { label: 'Cloud IAM', description: 'Identity & Access Management', nodes: gcpIamNodes, edges: gcpIamEdges },
  'gcp-gke': { label: 'GKE', description: 'Google Kubernetes Engine', nodes: gkeNodes, edges: gkeEdges },
  'gcp-gce': { label: 'Compute Engine', description: 'Virtual Machines', nodes: gcpGceNodes, edges: gcpGceEdges },
  'gcp-gcs': { label: 'Cloud Storage', description: 'Object Storage', nodes: gcpGcsNodes, edges: gcpGcsEdges },
  'gcp-cloudsql': { label: 'Cloud SQL', description: 'Managed Relational Database', nodes: gcpCloudSqlNodes, edges: gcpCloudSqlEdges },
  'gcp-functions': { label: 'Cloud Functions', description: 'Serverless Functions', nodes: gcpFunctionsNodes, edges: gcpFunctionsEdges },
  'gcp-monitoring': { label: 'Cloud Monitoring', description: 'Observability Suite', nodes: gcpMonitoringNodes, edges: gcpMonitoringEdges },
  'gcp-dns': { label: 'Cloud DNS', description: 'DNS Service', nodes: gcpDnsNodes, edges: gcpDnsEdges },
  'gcp-lb': { label: 'Cloud Load Balancing', description: 'Global Load Balancer', nodes: gcpLbNodes, edges: gcpLbEdges },
  'gcp-pubsub': { label: 'Pub/Sub', description: 'Messaging Service', nodes: gcpPubsubNodes, edges: gcpPubsubEdges },
  'gcp-bigquery': { label: 'BigQuery', description: 'Data Warehouse', nodes: gcpBigQueryNodes, edges: gcpBigQueryEdges },

  // GKE deep-dive
  'gke-control-plane': { label: 'GKE Control Plane', description: 'Kubernetes control plane', nodes: gkeControlPlaneNodes, edges: gkeControlPlaneEdges },
  'gke-node-pools': { label: 'Node Pools', description: 'Worker VM groups', nodes: gkeNodePoolNodes, edges: gkeNodePoolEdges },
  'gke-networking': { label: 'GKE Networking', description: 'VPC-native networking', nodes: gkeNetworkingNodes, edges: gkeNetworkingEdges },
  'gke-np-pods': { label: 'Pods', description: 'Pod internals', nodes: gkePodNodes, edges: gkePodEdges },

  // Azure
  azure: { label: 'Azure', description: 'Microsoft Azure', nodes: azureNodes, edges: azureEdges },
  'az-vnet': { label: 'Virtual Network', description: 'VNet – isolated network', nodes: azVnetNodes, edges: azVnetEdges },
  'az-ad': { label: 'Entra ID', description: 'Identity & Access Management', nodes: azEntraNodes, edges: azEntraEdges },
  'az-aks': { label: 'AKS', description: 'Azure Kubernetes Service', nodes: aksNodes, edges: aksEdges },
  'az-vm': { label: 'Virtual Machines', description: 'Azure VMs', nodes: azVmNodes, edges: azVmEdges },
  'az-blob': { label: 'Blob Storage', description: 'Object Storage', nodes: azBlobNodes, edges: azBlobEdges },
  'az-sql': { label: 'Azure SQL', description: 'Managed SQL Database', nodes: azSqlNodes, edges: azSqlEdges },
  'az-functions': { label: 'Azure Functions', description: 'Serverless Compute', nodes: azFunctionsNodes, edges: azFunctionsEdges },
  'az-monitor': { label: 'Azure Monitor', description: 'Monitoring & Diagnostics', nodes: azMonitorNodes, edges: azMonitorEdges },
  'az-dns': { label: 'Azure DNS', description: 'DNS Service', nodes: azDnsNodes, edges: azDnsEdges },
  'az-lb': { label: 'Load Balancer', description: 'Azure Load Balancer', nodes: azLbNodes, edges: azLbEdges },
  'az-servicebus': { label: 'Service Bus', description: 'Messaging Service', nodes: azServiceBusNodes, edges: azServiceBusEdges },
  'az-cosmos': { label: 'Cosmos DB', description: 'Multi-model NoSQL', nodes: azCosmosNodes, edges: azCosmosEdges },

  // AKS deep-dive
  'aks-control-plane': { label: 'AKS Control Plane', description: 'Kubernetes control plane', nodes: aksControlPlaneNodes, edges: aksControlPlaneEdges },
  'aks-node-pools': { label: 'Node Pools', description: 'VMSS worker nodes', nodes: aksNodePoolNodes, edges: aksNodePoolEdges },
  'aks-networking': { label: 'AKS Networking', description: 'Azure CNI networking', nodes: aksNetworkingNodes, edges: aksNetworkingEdges },
  'aks-np-pods': { label: 'Pods', description: 'Pod internals', nodes: aksPodNodes, edges: aksPodEdges },
};
