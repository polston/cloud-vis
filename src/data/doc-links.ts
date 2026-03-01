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
  'gke-net-network-policy': 'https://kubernetes.io/docs/concepts/services-networking/network-policies/',

  // ── GKE Top-level additions ────────────────────────────────────────
  'gke-autopilot': 'https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview',
  'gke-addons': 'https://cloud.google.com/kubernetes-engine/docs/concepts/add-on',
  'gke-workload-identity': 'https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity',

  // ── GKE Pod Internals ─────────────────────────────────────────────
  'gke-pod-containers': 'https://kubernetes.io/docs/concepts/containers/',
  'gke-pod-init-containers': 'https://kubernetes.io/docs/concepts/workloads/pods/init-containers/',
  'gke-pod-volumes': 'https://kubernetes.io/docs/concepts/storage/volumes/',
  'gke-pod-secrets': 'https://kubernetes.io/docs/concepts/configuration/secret/',
  'gke-pod-configmaps': 'https://kubernetes.io/docs/concepts/configuration/configmap/',
  'gke-pod-service-account': 'https://kubernetes.io/docs/concepts/security/service-accounts/',
  'gke-pod-probes': 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
  'gke-pod-resources': 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',

  // ── GCP VPC Network ───────────────────────────────────────────────
  'gcp-vpc-subnets': 'https://cloud.google.com/vpc/docs/subnets',
  'gcp-vpc-firewall': 'https://cloud.google.com/firewall/docs/firewalls',
  'gcp-vpc-nat': 'https://cloud.google.com/nat/docs/overview',
  'gcp-vpc-router': 'https://cloud.google.com/network-connectivity/docs/router/concepts/overview',
  'gcp-vpc-peering': 'https://cloud.google.com/vpc/docs/vpc-peering',
  'gcp-vpc-shared': 'https://cloud.google.com/vpc/docs/shared-vpc',
  'gcp-vpc-pga': 'https://cloud.google.com/vpc/docs/private-google-access',
  'gcp-vpc-psc': 'https://cloud.google.com/vpc/docs/private-service-connect',
  'gcp-vpc-interconnect': 'https://cloud.google.com/network-connectivity/docs/interconnect/concepts/overview',
  'gcp-vpc-flow-logs': 'https://cloud.google.com/vpc/docs/flow-logs',
  'gcp-vpc-static-ip': 'https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address',
  'gcp-vpc-routes': 'https://cloud.google.com/vpc/docs/routes',

  // ── GCP Cloud IAM ─────────────────────────────────────────────────
  'gcp-iam-members': 'https://cloud.google.com/iam/docs/overview#concepts_related_identity',
  'gcp-iam-roles': 'https://cloud.google.com/iam/docs/understanding-roles',
  'gcp-iam-policies': 'https://cloud.google.com/iam/docs/policies',
  'gcp-iam-sa': 'https://cloud.google.com/iam/docs/service-account-overview',
  'gcp-iam-wif': 'https://cloud.google.com/iam/docs/workload-identity-federation',
  'gcp-iam-org-policies': 'https://cloud.google.com/resource-manager/docs/organization-policy/overview',
  'gcp-iam-conditions': 'https://cloud.google.com/iam/docs/conditions-overview',
  'gcp-iam-audit': 'https://cloud.google.com/logging/docs/audit',
  'gcp-iam-iap': 'https://cloud.google.com/iap/docs/concepts-overview',
  'gcp-iam-recommender': 'https://cloud.google.com/iam/docs/recommender-overview',

  // ── GCP Compute Engine ────────────────────────────────────────────
  'gcp-gce-instances': 'https://cloud.google.com/compute/docs/instances',
  'gcp-gce-images': 'https://cloud.google.com/compute/docs/machine-images',
  'gcp-gce-mig': 'https://cloud.google.com/compute/docs/instance-groups',
  'gcp-gce-pd': 'https://cloud.google.com/compute/docs/disks',
  'gcp-gce-firewall': 'https://cloud.google.com/firewall/docs/firewalls',
  'gcp-gce-ssh': 'https://cloud.google.com/compute/docs/connect/create-ssh-keys',
  'gcp-gce-templates': 'https://cloud.google.com/compute/docs/instance-templates',
  'gcp-gce-nic': 'https://cloud.google.com/vpc/docs/multiple-interfaces-concepts',
  'gcp-gce-static-ip': 'https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address',
  'gcp-gce-local-ssd': 'https://cloud.google.com/compute/docs/disks/local-ssd',
  'gcp-gce-sole-tenant': 'https://cloud.google.com/compute/docs/nodes/sole-tenant-nodes',

  // ── GCP Cloud Storage ─────────────────────────────────────────────
  'gcp-gcs-buckets': 'https://cloud.google.com/storage/docs/buckets',
  'gcp-gcs-objects': 'https://cloud.google.com/storage/docs/objects',
  'gcp-gcs-versioning': 'https://cloud.google.com/storage/docs/object-versioning',
  'gcp-gcs-lifecycle': 'https://cloud.google.com/storage/docs/lifecycle',
  'gcp-gcs-encryption': 'https://cloud.google.com/storage/docs/encryption',
  'gcp-gcs-iam': 'https://cloud.google.com/storage/docs/access-control/iam',
  'gcp-gcs-classes': 'https://cloud.google.com/storage/docs/storage-classes',
  'gcp-gcs-notifications': 'https://cloud.google.com/storage/docs/pubsub-notifications',
  'gcp-gcs-replication': 'https://cloud.google.com/storage/docs/turbo-replication',

  // ── GCP Cloud SQL ─────────────────────────────────────────────────
  'gcp-csql-instances': 'https://cloud.google.com/sql/docs/mysql/create-instance',
  'gcp-csql-replicas': 'https://cloud.google.com/sql/docs/mysql/replication',
  'gcp-csql-ha': 'https://cloud.google.com/sql/docs/mysql/high-availability',
  'gcp-csql-backups': 'https://cloud.google.com/sql/docs/mysql/backup-recovery/backups',
  'gcp-csql-auto-backups': 'https://cloud.google.com/sql/docs/mysql/backup-recovery/pitr',
  'gcp-csql-flags': 'https://cloud.google.com/sql/docs/mysql/flags',
  'gcp-csql-private-ip': 'https://cloud.google.com/sql/docs/mysql/private-ip',
  'gcp-csql-proxy': 'https://cloud.google.com/sql/docs/mysql/sql-proxy',
  'gcp-csql-insights': 'https://cloud.google.com/sql/docs/mysql/using-query-insights',

  // ── GCP Cloud Functions ───────────────────────────────────────────
  'gcp-fn-functions': 'https://cloud.google.com/functions/docs/concepts/overview',
  'gcp-fn-triggers': 'https://cloud.google.com/functions/docs/calling',
  'gcp-fn-build': 'https://cloud.google.com/build/docs/overview',
  'gcp-fn-retry': 'https://cloud.google.com/functions/docs/bestpractices/retries',
  'gcp-fn-concurrency': 'https://cloud.google.com/functions/docs/configuring/max-instances',
  'gcp-fn-min-instances': 'https://cloud.google.com/functions/docs/configuring/min-instances',
  'gcp-fn-versions': 'https://cloud.google.com/functions/docs/concepts/version-management',
  'gcp-fn-env-vars': 'https://cloud.google.com/functions/docs/configuring/env-var',
  'gcp-fn-vpc-connector': 'https://cloud.google.com/functions/docs/networking/connecting-vpc',
  'gcp-fn-dlt': 'https://cloud.google.com/functions/docs/bestpractices/retries#set_a_dead_letter_topic',

  // ── GCP Cloud Monitoring ──────────────────────────────────────────
  'gcp-mon-metrics': 'https://cloud.google.com/monitoring/api/metrics_gcp',
  'gcp-mon-alerts': 'https://cloud.google.com/monitoring/alerts',
  'gcp-mon-uptime': 'https://cloud.google.com/monitoring/uptime-checks',
  'gcp-mon-logging': 'https://cloud.google.com/logging/docs',
  'gcp-mon-log-analytics': 'https://cloud.google.com/logging/docs/log-analytics',
  'gcp-mon-dashboards': 'https://cloud.google.com/monitoring/dashboards',
  'gcp-mon-slo': 'https://cloud.google.com/monitoring/slo',
  'gcp-mon-gke': 'https://cloud.google.com/monitoring/kubernetes-engine',
  'gcp-mon-synthetics': 'https://cloud.google.com/monitoring/uptime-checks/introduction',

  // ── GCP Cloud DNS ─────────────────────────────────────────────────
  'gcp-dns-zones': 'https://cloud.google.com/dns/docs/zones',
  'gcp-dns-records': 'https://cloud.google.com/dns/docs/records',
  'gcp-dns-health': 'https://cloud.google.com/dns/docs/overview#health_checks',
  'gcp-dns-routing': 'https://cloud.google.com/dns/docs/overview#routing_policies',
  'gcp-dns-peering': 'https://cloud.google.com/dns/docs/overview#peering',
  'gcp-dns-dnssec': 'https://cloud.google.com/dns/docs/dnssec',

  // ── GCP Cloud Load Balancing ──────────────────────────────────────
  'gcp-lb-http': 'https://cloud.google.com/load-balancing/docs/https',
  'gcp-lb-tcp': 'https://cloud.google.com/load-balancing/docs/tcp',
  'gcp-lb-network': 'https://cloud.google.com/load-balancing/docs/network',
  'gcp-lb-backend': 'https://cloud.google.com/load-balancing/docs/backend-service',
  'gcp-lb-urlmap': 'https://cloud.google.com/load-balancing/docs/url-map-concepts',
  'gcp-lb-health': 'https://cloud.google.com/load-balancing/docs/health-check-concepts',
  'gcp-lb-ssl': 'https://cloud.google.com/load-balancing/docs/ssl-certificates-concepts',

  // ── GCP Pub/Sub ───────────────────────────────────────────────────
  'gcp-ps-topics': 'https://cloud.google.com/pubsub/docs/create-topic',
  'gcp-ps-subs': 'https://cloud.google.com/pubsub/docs/create-subscription',
  'gcp-ps-dlq': 'https://cloud.google.com/pubsub/docs/handling-failures',
  'gcp-ps-ordering': 'https://cloud.google.com/pubsub/docs/ordering',
  'gcp-ps-schemas': 'https://cloud.google.com/pubsub/docs/schemas',
  'gcp-ps-snapshots': 'https://cloud.google.com/pubsub/docs/replay-overview',

  // ── GCP BigQuery ──────────────────────────────────────────────────
  'gcp-bq-datasets': 'https://cloud.google.com/bigquery/docs/datasets-intro',
  'gcp-bq-tables': 'https://cloud.google.com/bigquery/docs/tables-intro',
  'gcp-bq-views': 'https://cloud.google.com/bigquery/docs/views-intro',
  'gcp-bq-mv': 'https://cloud.google.com/bigquery/docs/materialized-views-intro',
  'gcp-bq-scheduled': 'https://cloud.google.com/bigquery/docs/scheduling-queries',
  'gcp-bq-reservations': 'https://cloud.google.com/bigquery/docs/reservations-intro',
  'gcp-bq-streaming': 'https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery',

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
  'aks-net-network-policy': 'https://learn.microsoft.com/en-us/azure/aks/use-network-policies',

  // ── AKS Top-level additions ────────────────────────────────────────
  'aks-virtual-nodes': 'https://learn.microsoft.com/en-us/azure/aks/virtual-nodes',
  'aks-addons': 'https://learn.microsoft.com/en-us/azure/aks/integrations',
  'aks-workload-identity': 'https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview',

  // ── AKS Pod Internals ─────────────────────────────────────────────
  'aks-pod-containers': 'https://kubernetes.io/docs/concepts/containers/',
  'aks-pod-init-containers': 'https://kubernetes.io/docs/concepts/workloads/pods/init-containers/',
  'aks-pod-volumes': 'https://kubernetes.io/docs/concepts/storage/volumes/',
  'aks-pod-secrets': 'https://kubernetes.io/docs/concepts/configuration/secret/',
  'aks-pod-configmaps': 'https://kubernetes.io/docs/concepts/configuration/configmap/',
  'aks-pod-service-account': 'https://kubernetes.io/docs/concepts/security/service-accounts/',
  'aks-pod-probes': 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
  'aks-pod-resources': 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',

  // ── Azure Virtual Network ─────────────────────────────────────────
  'az-vnet-subnets': 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-subnet',
  'az-vnet-nsg': 'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
  'az-vnet-nat': 'https://learn.microsoft.com/en-us/azure/nat-gateway/nat-overview',
  'az-vnet-rt': 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview',
  'az-vnet-peering': 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview',
  'az-vnet-private-ep': 'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview',
  'az-vnet-service-ep': 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview',
  'az-vnet-pip': 'https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/public-ip-addresses',
  'az-vnet-firewall': 'https://learn.microsoft.com/en-us/azure/firewall/overview',
  'az-vnet-vng': 'https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways',
  'az-vnet-ddos': 'https://learn.microsoft.com/en-us/azure/ddos-protection/ddos-protection-overview',
  'az-vnet-nic': 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface-overview',

  // ── Azure Entra ID ────────────────────────────────────────────────
  'az-ad-users': 'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-create-delete-users',
  'az-ad-groups': 'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups',
  'az-ad-app-reg': 'https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app',
  'az-ad-sp': 'https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals',
  'az-ad-mi': 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview',
  'az-ad-ca': 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview',
  'az-ad-rbac': 'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview',
  'az-ad-pim': 'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure',
  'az-ad-enterprise': 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/what-is-application-management',
  'az-ad-mfa': 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks',

  // ── Azure Virtual Machines ────────────────────────────────────────
  'az-vm-instances': 'https://learn.microsoft.com/en-us/azure/virtual-machines/overview',
  'az-vm-images': 'https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries',
  'az-vm-vmss': 'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview',
  'az-vm-disks': 'https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview',
  'az-vm-nsg': 'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
  'az-vm-ssh': 'https://learn.microsoft.com/en-us/azure/virtual-machines/ssh-keys-portal',
  'az-vm-templates': 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview',
  'az-vm-nic': 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface-overview',
  'az-vm-pip': 'https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/public-ip-addresses',
  'az-vm-temp-disk': 'https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview#temporary-disk',
  'az-vm-ppg': 'https://learn.microsoft.com/en-us/azure/virtual-machines/co-location',

  // ── Azure Blob Storage ────────────────────────────────────────────
  'az-blob-containers': 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction#containers',
  'az-blob-blobs': 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction#blobs',
  'az-blob-versioning': 'https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview',
  'az-blob-lifecycle': 'https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview',
  'az-blob-encryption': 'https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption',
  'az-blob-access': 'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview',
  'az-blob-tiers': 'https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview',
  'az-blob-events': 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-event-overview',
  'az-blob-replication': 'https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview',

  // ── Azure SQL ─────────────────────────────────────────────────────
  'az-sql-databases': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview',
  'az-sql-geo-rep': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/active-geo-replication-overview',
  'az-sql-failover': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/failover-group-sql-db',
  'az-sql-pitr': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/recovery-using-backups',
  'az-sql-ltr': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/long-term-retention-overview',
  'az-sql-config': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/logical-servers',
  'az-sql-vnet': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/vnet-service-endpoint-rule-overview',
  'az-sql-elastic': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/elastic-pool-overview',
  'az-sql-qpi': 'https://learn.microsoft.com/en-us/azure/azure-sql/database/query-performance-insight-use',

  // ── Azure Functions ───────────────────────────────────────────────
  'az-fn-functions': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview',
  'az-fn-triggers': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings',
  'az-fn-slots': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-slots',
  'az-fn-durable': 'https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview',
  'az-fn-plan': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale',
  'az-fn-settings': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-app-settings',
  'az-fn-vnet': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-networking-options',
  'az-fn-env-vars': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference#environment-variables',
  'az-fn-dlq': 'https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-error-pages',

  // ── Azure Monitor ─────────────────────────────────────────────────
  'az-mon-metrics': 'https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/data-platform-metrics',
  'az-mon-alerts': 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview',
  'az-mon-action-groups': 'https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups',
  'az-mon-log-analytics': 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview',
  'az-mon-kql': 'https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/',
  'az-mon-dashboards': 'https://learn.microsoft.com/en-us/azure/azure-monitor/visualizations',
  'az-mon-app-insights': 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview',
  'az-mon-container': 'https://learn.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-overview',
  'az-mon-avail': 'https://learn.microsoft.com/en-us/azure/azure-monitor/app/availability-overview',

  // ── Azure DNS ─────────────────────────────────────────────────────
  'az-dns-zones': 'https://learn.microsoft.com/en-us/azure/dns/dns-zones-records',
  'az-dns-records': 'https://learn.microsoft.com/en-us/azure/dns/dns-zones-records#dns-records',
  'az-dns-private': 'https://learn.microsoft.com/en-us/azure/dns/private-dns-overview',
  'az-dns-tm': 'https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview',
  'az-dns-health': 'https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-monitoring',
  'az-dns-frontdoor': 'https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview',

  // ── Azure Load Balancer ───────────────────────────────────────────
  'az-lb-standard': 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview',
  'az-lb-appgw': 'https://learn.microsoft.com/en-us/azure/application-gateway/overview',
  'az-lb-frontdoor': 'https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview',
  'az-lb-backend': 'https://learn.microsoft.com/en-us/azure/load-balancer/backend-pool-management',
  'az-lb-probes': 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview',
  'az-lb-rules': 'https://learn.microsoft.com/en-us/azure/load-balancer/components#load-balancing-rules',
  'az-lb-waf': 'https://learn.microsoft.com/en-us/azure/web-application-firewall/overview',

  // ── Azure Service Bus ─────────────────────────────────────────────
  'az-sb-queues': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#queues',
  'az-sb-topics': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#topics-and-subscriptions',
  'az-sb-subs': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#topics-and-subscriptions',
  'az-sb-dlq': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues',
  'az-sb-sessions': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-sessions',
  'az-sb-forward': 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-auto-forwarding',

  // ── Azure Cosmos DB ───────────────────────────────────────────────
  'az-cosmos-databases': 'https://learn.microsoft.com/en-us/azure/cosmos-db/resource-model',
  'az-cosmos-containers': 'https://learn.microsoft.com/en-us/azure/cosmos-db/resource-model#azure-cosmos-db-containers',
  'az-cosmos-consistency': 'https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels',
  'az-cosmos-partitioning': 'https://learn.microsoft.com/en-us/azure/cosmos-db/partitioning-overview',
  'az-cosmos-change-feed': 'https://learn.microsoft.com/en-us/azure/cosmos-db/change-feed',
  'az-cosmos-sprocs': 'https://learn.microsoft.com/en-us/azure/cosmos-db/stored-procedures-triggers-udfs',
  'az-cosmos-global': 'https://learn.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally',
};
