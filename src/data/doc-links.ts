/**
 * Documentation URLs for each node in the graph.
 * Key = node ID, value = canonical documentation URL.
 */
export const docLinks: Record<string, string> = {
  // ── Top-level providers ──────────────────────────────────────────────
  aws: 'https://docs.aws.amazon.com/',
  gcp: 'https://cloud.google.com/docs',
  azure: 'https://learn.microsoft.com/en-us/azure/',

  // ═══════════════════════════════════════════════════════════════════════
  // AWS — Service categories
  // ═══════════════════════════════════════════════════════════════════════
  'aws-vpc': 'https://docs.aws.amazon.com/vpc/latest/userguide/',
  'aws-iam': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/',
  'aws-eks': 'https://docs.aws.amazon.com/eks/latest/userguide/',
  'aws-ec2': 'https://docs.aws.amazon.com/ec2/latest/userguide/',
  'aws-s3': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/',
  'aws-rds': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/',
  'aws-lambda': 'https://docs.aws.amazon.com/lambda/latest/dg/',
  'aws-cloudwatch': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/',
  'aws-route53': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/',
  'aws-elb': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/',
  'aws-sqs': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/',
  'aws-sns': 'https://docs.aws.amazon.com/sns/latest/dg/',
  'aws-eventbridge': 'https://docs.aws.amazon.com/eventbridge/latest/userguide/',

  // ── AWS VPC ──────────────────────────────────────────────────────────
  'vpc-subnets': 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html',
  'vpc-igw': 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html',
  'vpc-nat': 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html',
  'vpc-sg': 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
  'vpc-nacl': 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html',
  'vpc-rt': 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html',
  'vpc-endpoints': 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html',
  'vpc-peering': 'https://docs.aws.amazon.com/vpc/latest/peering/',
  'vpc-flow-logs': 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html',
  'vpc-tgw': 'https://docs.aws.amazon.com/vpc/latest/tgw/',
  'vpc-eip': 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-eips.html',
  'vpc-eni': 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html',

  // ── AWS IAM ──────────────────────────────────────────────────────────
  'iam-users': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html',
  'iam-roles': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
  'iam-policies': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html',
  'iam-groups': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html',
  'iam-mfa': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html',
  'iam-sts': 'https://docs.aws.amazon.com/STS/latest/APIReference/',
  'iam-idp': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html',
  'iam-instance-profiles': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html',
  'iam-permission-boundaries': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html',
  'iam-access-keys': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html',
  'iam-access-analyzer': 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html',

  // ── AWS EKS ──────────────────────────────────────────────────────────
  'eks-control-plane': 'https://docs.aws.amazon.com/eks/latest/userguide/clusters.html',
  'eks-worker-nodes': 'https://docs.aws.amazon.com/eks/latest/userguide/worker.html',
  'eks-networking': 'https://docs.aws.amazon.com/eks/latest/userguide/eks-networking.html',
  'eks-fargate': 'https://docs.aws.amazon.com/eks/latest/userguide/fargate.html',
  'eks-addons': 'https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html',
  'eks-pod-identity': 'https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html',

  // ── EKS Control Plane ────────────────────────────────────────────────
  'cp-api-server': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/',
  'cp-etcd': 'https://etcd.io/docs/',
  'cp-scheduler': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/',
  'cp-controller-manager': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/',
  'cp-cloud-controller': 'https://kubernetes.io/docs/concepts/architecture/cloud-controller/',
  'cp-admission': 'https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/',

  // ── EKS Worker Nodes ─────────────────────────────────────────────────
  'wn-kubelet': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/',
  'wn-kube-proxy': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/',
  'wn-container-runtime': 'https://kubernetes.io/docs/setup/production-environment/container-runtimes/',
  'wn-pods': 'https://kubernetes.io/docs/concepts/workloads/pods/',
  'wn-daemonsets': 'https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/',
  'wn-node-resources': 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',

  // ── Pod internals ────────────────────────────────────────────────────
  'pod-containers': 'https://kubernetes.io/docs/concepts/containers/',
  'pod-init-containers': 'https://kubernetes.io/docs/concepts/workloads/pods/init-containers/',
  'pod-volumes': 'https://kubernetes.io/docs/concepts/storage/volumes/',
  'pod-secrets': 'https://kubernetes.io/docs/concepts/configuration/secret/',
  'pod-configmaps': 'https://kubernetes.io/docs/concepts/configuration/configmap/',
  'pod-service-account': 'https://kubernetes.io/docs/concepts/security/service-accounts/',
  'pod-probes': 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
  'pod-resources': 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',

  // ── EKS Networking ───────────────────────────────────────────────────
  'net-vpc-cni': 'https://docs.aws.amazon.com/eks/latest/userguide/pod-networking.html',
  'net-coredns': 'https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html',
  'net-ingress': 'https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html',
  'net-services': 'https://kubernetes.io/docs/concepts/services-networking/service/',
  'net-network-policy': 'https://kubernetes.io/docs/concepts/services-networking/network-policies/',

  // ── AWS EC2 ──────────────────────────────────────────────────────────
  'ec2-instances': 'https://docs.aws.amazon.com/ec2/latest/userguide/Instances.html',
  'ec2-ami': 'https://docs.aws.amazon.com/ec2/latest/userguide/AMIs.html',
  'ec2-asg': 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/',
  'ec2-ebs': 'https://docs.aws.amazon.com/ebs/latest/userguide/',
  'ec2-sg': 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
  'ec2-keypairs': 'https://docs.aws.amazon.com/ec2/latest/userguide/ec2-key-pairs.html',
  'ec2-launch-templates': 'https://docs.aws.amazon.com/ec2/latest/userguide/ec2-launch-templates.html',
  'ec2-eni': 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html',
  'ec2-eip': 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-eips.html',
  'ec2-instance-store': 'https://docs.aws.amazon.com/ec2/latest/userguide/InstanceStorage.html',
  'ec2-placement-groups': 'https://docs.aws.amazon.com/ec2/latest/userguide/placement-groups.html',

  // ── AWS S3 ───────────────────────────────────────────────────────────
  's3-buckets': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-buckets-s3.html',
  's3-objects': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingObjects.html',
  's3-versioning': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html',
  's3-lifecycle': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html',
  's3-encryption': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html',
  's3-policies': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html',
  's3-storage-classes': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html',
  's3-event-notifications': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html',
  's3-replication': 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html',

  // ── AWS RDS ──────────────────────────────────────────────────────────
  'rds-instances': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html',
  'rds-replicas': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html',
  'rds-multi-az': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html',
  'rds-snapshots': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html',
  'rds-automated-backups': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html',
  'rds-pg': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html',
  'rds-subnet-group': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html',
  'rds-proxy': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html',
  'rds-perf-insights': 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html',

  // ── AWS Lambda ───────────────────────────────────────────────────────
  'lambda-functions': 'https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html',
  'lambda-layers': 'https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html',
  'lambda-triggers': 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html',
  'lambda-destinations': 'https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-async-destinations',
  'lambda-reserved': 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html',
  'lambda-provisioned': 'https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html',
  'lambda-versions': 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html',
  'lambda-env-vars': 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html',
  'lambda-vpc': 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html',
  'lambda-dlq': 'https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html#invocation-dlq',

  // ── AWS CloudWatch ───────────────────────────────────────────────────
  'cw-metrics': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html',
  'cw-alarms': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html',
  'cw-composite-alarms': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html',
  'cw-logs': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/',
  'cw-logs-insights': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html',
  'cw-dashboards': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html',
  'cw-anomaly-detection': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html',
  'cw-container-insights': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html',
  'cw-synthetics': 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html',

  // ── AWS Route 53 ─────────────────────────────────────────────────────
  'r53-hosted-zones': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html',
  'r53-records': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/rrsets-working-with.html',
  'r53-health-checks': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-creating.html',
  'r53-routing': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html',
  'r53-resolver': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html',
  'r53-dns-firewall': 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-dns-firewall.html',

  // ── AWS ELB ──────────────────────────────────────────────────────────
  'elb-alb': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/',
  'elb-nlb': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/',
  'elb-gwlb': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/',
  'elb-target-groups': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html',
  'elb-listeners': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html',
  'elb-health-checks': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html',
  'elb-rules': 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html',

  // ── AWS SQS ──────────────────────────────────────────────────────────
  'sqs-standard': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html',
  'sqs-fifo': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html',
  'sqs-dlq': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html',
  'sqs-visibility': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html',
  'sqs-long-polling': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html',
  'sqs-msg-attrs': 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html',

  // ── AWS SNS ──────────────────────────────────────────────────────────
  'sns-standard-topics': 'https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html',
  'sns-fifo-topics': 'https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html',
  'sns-subscriptions': 'https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html',
  'sns-filtering': 'https://docs.aws.amazon.com/sns/latest/dg/sns-subscription-filter-policies.html',
  'sns-dlq': 'https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html',

  // ═══════════════════════════════════════════════════════════════════════
  // GCP — Service categories
  // ═══════════════════════════════════════════════════════════════════════
  'gcp-vpc': 'https://cloud.google.com/vpc/docs',
  'gcp-iam': 'https://cloud.google.com/iam/docs',
  'gcp-gke': 'https://cloud.google.com/kubernetes-engine/docs',
  'gcp-gce': 'https://cloud.google.com/compute/docs',
  'gcp-gcs': 'https://cloud.google.com/storage/docs',
  'gcp-cloudsql': 'https://cloud.google.com/sql/docs',
  'gcp-functions': 'https://cloud.google.com/functions/docs',
  'gcp-monitoring': 'https://cloud.google.com/monitoring/docs',
  'gcp-dns': 'https://cloud.google.com/dns/docs',
  'gcp-lb': 'https://cloud.google.com/load-balancing/docs',
  'gcp-pubsub': 'https://cloud.google.com/pubsub/docs',
  'gcp-bigquery': 'https://cloud.google.com/bigquery/docs',

  // ── GKE ──────────────────────────────────────────────────────────────
  'gke-control-plane': 'https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#control_plane',
  'gke-node-pools': 'https://cloud.google.com/kubernetes-engine/docs/concepts/node-pools',
  'gke-networking': 'https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview',

  // ── GKE Control Plane ────────────────────────────────────────────────
  'gke-cp-api': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/',
  'gke-cp-etcd': 'https://etcd.io/docs/',
  'gke-cp-scheduler': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/',
  'gke-cp-controller': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/',
  'gke-cp-cloud-controller': 'https://kubernetes.io/docs/concepts/architecture/cloud-controller/',

  // ── GKE Node Pools ───────────────────────────────────────────────────
  'gke-np-kubelet': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/',
  'gke-np-proxy': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/',
  'gke-np-runtime': 'https://kubernetes.io/docs/setup/production-environment/container-runtimes/',
  'gke-np-pods': 'https://kubernetes.io/docs/concepts/workloads/pods/',

  // ── GKE Networking ───────────────────────────────────────────────────
  'gke-net-vpc-native': 'https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips',
  'gke-net-dns': 'https://cloud.google.com/kubernetes-engine/docs/how-to/kube-dns',
  'gke-net-ingress': 'https://cloud.google.com/kubernetes-engine/docs/concepts/ingress',
  'gke-net-services': 'https://kubernetes.io/docs/concepts/services-networking/service/',

  // ═══════════════════════════════════════════════════════════════════════
  // Azure — Service categories
  // ═══════════════════════════════════════════════════════════════════════
  'az-vnet': 'https://learn.microsoft.com/en-us/azure/virtual-network/',
  'az-ad': 'https://learn.microsoft.com/en-us/entra/fundamentals/',
  'az-aks': 'https://learn.microsoft.com/en-us/azure/aks/',
  'az-vm': 'https://learn.microsoft.com/en-us/azure/virtual-machines/',
  'az-blob': 'https://learn.microsoft.com/en-us/azure/storage/blobs/',
  'az-sql': 'https://learn.microsoft.com/en-us/azure/azure-sql/',
  'az-functions': 'https://learn.microsoft.com/en-us/azure/azure-functions/',
  'az-monitor': 'https://learn.microsoft.com/en-us/azure/azure-monitor/',
  'az-dns': 'https://learn.microsoft.com/en-us/azure/dns/',
  'az-lb': 'https://learn.microsoft.com/en-us/azure/load-balancer/',
  'az-servicebus': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/',
  'az-cosmos': 'https://learn.microsoft.com/en-us/azure/cosmos-db/',

  // ── AKS ──────────────────────────────────────────────────────────────
  'aks-control-plane': 'https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads#control-plane',
  'aks-node-pools': 'https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads#node-pools',
  'aks-networking': 'https://learn.microsoft.com/en-us/azure/aks/concepts-network',

  // ── AKS Control Plane ────────────────────────────────────────────────
  'aks-cp-api': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/',
  'aks-cp-etcd': 'https://etcd.io/docs/',
  'aks-cp-scheduler': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/',
  'aks-cp-controller': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/',
  'aks-cp-cloud-controller': 'https://kubernetes.io/docs/concepts/architecture/cloud-controller/',

  // ── AKS Node Pools ───────────────────────────────────────────────────
  'aks-np-kubelet': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/',
  'aks-np-proxy': 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/',
  'aks-np-runtime': 'https://kubernetes.io/docs/setup/production-environment/container-runtimes/',
  'aks-np-pods': 'https://kubernetes.io/docs/concepts/workloads/pods/',

  // ── AKS Networking ───────────────────────────────────────────────────
  'aks-net-cni': 'https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni',
  'aks-net-dns': 'https://kubernetes.io/docs/tasks/administer-cluster/coredns/',
  'aks-net-ingress': 'https://learn.microsoft.com/en-us/azure/application-gateway/ingress-controller-overview',
  'aks-net-services': 'https://kubernetes.io/docs/concepts/services-networking/service/',
};
