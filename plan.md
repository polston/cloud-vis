# Plan: Expand GCP & Azure to AWS-Level Detail

## Current State Analysis

### What AWS has that GCP/Azure are missing

| Service Category | AWS Detail | GCP Detail | Azure Detail |
|---|---|---|---|
| Networking (VPC/VNet) | 12 nodes, 13 edges | **EMPTY** (marked expandable, no content) | **EMPTY** |
| Identity (IAM/Entra) | 11 nodes, 13 edges | **EMPTY** | **EMPTY** |
| Kubernetes (EKS/GKE/AKS) | 6+6+6+5+8 nodes (5 levels) | 3+5+4+4 nodes (3 levels) | 3+5+4+4 nodes (3 levels) |
| Compute (EC2/GCE/VM) | 11 nodes, 11 edges | **EMPTY** | **EMPTY** |
| Storage (S3/GCS/Blob) | 9 nodes, 10 edges | **EMPTY** | **EMPTY** |
| Database (RDS/CloudSQL/SQL) | 9 nodes, 8 edges | **EMPTY** | **EMPTY** |
| Serverless (Lambda/Functions) | 10 nodes, 9 edges | **EMPTY** | **EMPTY** |
| Monitoring (CloudWatch/Monitor) | 9 nodes, 12 edges | **EMPTY** | **EMPTY** |
| DNS (Route53/DNS) | 6 nodes, 5 edges | No drill-down | No drill-down |
| Load Balancing (ELB/LB) | 7 nodes, 7 edges | No drill-down | No drill-down |
| Messaging (SQS+SNS/PubSub/ServiceBus) | 6+5 nodes, 8+4 edges | No drill-down | No drill-down |
| Unique services | EventBridge (leaf) | BigQuery (leaf) | Cosmos DB (leaf) |

**Critical bug**: 8 GCP services and 7 Azure services are marked `isGroup: true, hasChildren: true` but have NO registry entries — clicking them leads to an empty/broken drill-down.

### Missing Cross-Service Edges

**AWS** (missing 4):
1. `aws-ec2` -> `aws-iam` ('Auth') — instances use IAM instance profiles
2. `aws-lambda` -> `aws-iam` ('Auth') — Lambda needs execution roles
3. `aws-rds` -> `aws-vpc` ('Inside') — RDS runs inside VPC subnets
4. `aws-lambda` -> `aws-s3` ('Read/Write') — Lambda commonly accesses S3

**GCP** (missing 5):
1. `gcp-gce` -> `gcp-iam` ('Auth') — VMs use service accounts
2. `gcp-functions` -> `gcp-iam` ('Auth') — Functions use service accounts
3. `gcp-monitoring` -> `gcp-cloudsql` ('Monitors')
4. `gcp-monitoring` -> `gcp-lb` ('Monitors')
5. `gcp-lb` -> `gcp-functions` ('Traffic') — LB can front Cloud Functions

**Azure** (missing 6):
1. `az-vm` -> `az-ad` ('Auth') — VMs use managed identities
2. `az-functions` -> `az-ad` ('Auth') — Functions use managed identities
3. `az-monitor` -> `az-sql` ('Monitors')
4. `az-monitor` -> `az-blob` ('Monitors')
5. `az-monitor` -> `az-lb` ('Monitors')
6. `az-lb` -> `az-functions` ('Traffic') — LB can front Azure Functions

---

## Implementation Plan

### Phase 1: Fix Missing AWS Edges + Audit Existing (graph-data.ts, doc-links.ts)

Add 4 missing AWS cross-service edges. No new nodes needed.

### Phase 2: GCP Service Drill-Downs (graph-data.ts, doc-links.ts)

Add drill-down content for all 8 expandable GCP services + make 4 leaf services expandable:

#### 2a. GCP VPC Network (~12 nodes)
- Subnets, Cloud Router, Cloud NAT, Firewall Rules, VPC Peering, Shared VPC, Private Google Access, Private Service Connect, Cloud Interconnect, VPC Flow Logs, Static External IPs, Network Interfaces

#### 2b. GCP Cloud IAM (~10 nodes)
- Members, Roles, Policies (IAM Bindings), Service Accounts, Workload Identity Federation, Organization Policies, IAM Conditions, Audit Logs, Identity-Aware Proxy, Access Context Manager

#### 2c. GCP Compute Engine (~11 nodes)
- VM Instances, Machine Images, Managed Instance Groups, Persistent Disks, Firewall Rules, SSH Keys, Instance Templates, Network Interfaces, Static IPs, Local SSDs, Sole-Tenant Nodes

#### 2d. GCP Cloud Storage (~9 nodes)
- Buckets, Objects, Versioning, Lifecycle Rules, Encryption (CMEK/CSEK), Bucket IAM, Storage Classes, Pub/Sub Notifications, Turbo Replication

#### 2e. GCP Cloud SQL (~9 nodes)
- Instances, Read Replicas, High Availability, On-demand Backups, Automated Backups, Database Flags, Private IP, Cloud SQL Auth Proxy, Query Insights

#### 2f. GCP Cloud Functions (~9 nodes)
- Functions, Build Configuration, Event Triggers (Eventarc), Retry Policy, Concurrency Settings, Min Instances, Versions, Environment Variables, VPC Connector

#### 2g. GCP Cloud Monitoring (~9 nodes)
- Metrics, Alerting Policies, Uptime Checks, Cloud Logging, Logs Explorer, Dashboards, Service Monitoring, GKE Monitoring, Synthetic Monitors

#### 2h. GCP Cloud DNS — make expandable (~6 nodes)
- Managed Zones, Record Sets, Health Checks, Routing Policies, DNS Peering, DNSSEC

#### 2i. GCP Cloud Load Balancing — make expandable (~7 nodes)
- HTTP(S) LB, TCP/SSL Proxy LB, Network LB, Backend Services, URL Maps, Health Checks, SSL Certificates

#### 2j. GCP Pub/Sub — make expandable (~6 nodes)
- Topics, Subscriptions, Dead Letter Topics, Message Ordering, Schemas, Snapshots

#### 2k. GCP BigQuery — make expandable (~7 nodes)
- Datasets, Tables, Views, Materialized Views, Scheduled Queries, Reservations, Streaming

#### 2l. Add 5 missing GCP cross-service edges

### Phase 3: Azure Service Drill-Downs (graph-data.ts, doc-links.ts)

Add drill-down content for all 7 expandable Azure services + make 4 leaf services expandable:

#### 3a. Azure Virtual Network (~12 nodes)
- Subnets, Network Security Groups (NSGs), Route Tables, VNet Peering, Service Endpoints, Private Endpoints, NAT Gateway, Public IPs, Azure Firewall, Virtual Network Gateway, DDoS Protection, Network Interfaces (NICs)

#### 3b. Azure Entra ID (~10 nodes)
- Users, Groups, App Registrations, Service Principals, Managed Identities, Conditional Access, RBAC Role Assignments, PIM (Privileged Identity Mgmt), Enterprise Applications, Multi-Factor Auth

#### 3c. Azure Virtual Machines (~11 nodes)
- VMs, VM Images, VM Scale Sets (VMSS), Managed Disks, NSGs, SSH Keys, ARM/Bicep Templates, NICs, Public IPs, Temporary Disks, Proximity Placement Groups

#### 3d. Azure Blob Storage (~9 nodes)
- Containers, Blobs, Versioning, Lifecycle Management, Encryption (SSE/CMK), Access Policies & SAS, Access Tiers (Hot/Cool/Cold/Archive), Event Grid Notifications, Object Replication

#### 3e. Azure SQL (~9 nodes)
- Databases, Geo-Replication, Failover Groups, Point-in-Time Restore, Long-Term Retention, Server Configuration, VNet Rules/Private Link, Elastic Pools, Query Performance Insights

#### 3f. Azure Functions (~9 nodes)
- Functions, Deployment Slots, Triggers & Bindings, Durable Functions, Premium/Consumption Plan, App Settings, VNet Integration, Function Proxies, Application Insights Integration

#### 3g. Azure Monitor (~9 nodes)
- Metrics, Alerts, Action Groups, Log Analytics Workspace, KQL Queries, Dashboards, Application Insights, Container Insights, Availability Tests

#### 3h. Azure DNS — make expandable (~6 nodes)
- DNS Zones, Record Sets, Traffic Manager, Azure Front Door, Health Probes, DNSSEC

#### 3i. Azure Load Balancer — make expandable (~7 nodes)
- Standard LB, Application Gateway, Front Door, Backend Pools, Health Probes, Load Balancing Rules, WAF Policies

#### 3j. Azure Service Bus — make expandable (~6 nodes)
- Queues, Topics, Subscriptions, Dead Letter Queues, Message Sessions, Auto-Forwarding

#### 3k. Azure Cosmos DB — make expandable (~7 nodes)
- Databases, Containers, Consistency Levels, Partitioning, Change Feed, Stored Procedures, Global Distribution

#### 3l. Add 6 missing Azure cross-service edges

### Phase 4: Documentation Links (doc-links.ts)

Add documentation URLs for every new node:
- ~96 new GCP doc links (cloud.google.com)
- ~96 new Azure doc links (learn.microsoft.com)
- ~192 new entries total

### Phase 5: GKE/AKS Kubernetes Parity with EKS

Bring GKE and AKS Kubernetes drill-downs to the same depth as EKS:
- Add Fargate equivalent nodes (GKE Autopilot, AKS Virtual Nodes)
- Add Add-ons/Extensions nodes
- Add Pod Identity nodes (Workload Identity for GKE, Azure Workload Identity for AKS)
- Add Pod internals level for GKE and AKS (containers, volumes, secrets, etc.)
- Add Network Policies to GKE and AKS networking

### Phase 6: Verify & Test

- Build the project (`npm run build`) and fix any TypeScript errors
- Spot-check navigation for every new drill-down level
- Verify all doc links are valid URLs

---

## Estimated Scope

| Item | Count |
|---|---|
| New GCP nodes | ~96 |
| New GCP edges | ~85 |
| New Azure nodes | ~96 |
| New Azure edges | ~85 |
| New AWS edges (fixes) | 4 |
| New GKE/AKS K8s nodes | ~16 |
| New doc links | ~210 |
| Files modified | 2 (graph-data.ts, doc-links.ts) |

All changes are data-only in `src/data/`. No component or layout code changes needed — the visualization engine is fully data-driven.
