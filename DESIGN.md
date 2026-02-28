# Cloud Infrastructure Visualizer — Design Document

> **Last updated:** 2026-02-28
> **Status:** Active development

## 1. Overview

Cloud-Vis is an interactive web application that visualizes cloud infrastructure across AWS, GCP, and Azure as a navigable graph. Users can explore services at multiple levels of detail — from a high-level multi-cloud overview down to individual Kubernetes pod internals — using two complementary view modes.

### Goals

- Provide a unified visual map of cloud infrastructure across all three major providers
- Support hierarchical drill-down navigation so users can understand how services compose
- Offer both a detailed explorer view and a birds-eye zone view of the full topology
- Use semantic edge styling (color + direction) to convey relationship types at a glance
- Deploy as a static site on GitHub Pages with zero backend dependencies

### Non-Goals (currently)

- Connecting to live cloud accounts or importing real infrastructure state
- Editing or provisioning infrastructure
- Cost analysis or compliance reporting

---

## 2. Architecture

### 2.1 Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | React 19 + TypeScript 5.9                               |
| Build tool   | Vite 7                                                  |
| Graph engine | React Flow (`@xyflow/react` v12) — nodes, edges, canvas |
| Auto-layout  | Dagre 0.8 — directed graph layout algorithm             |
| Icons        | Lucide React — consistent icon set                      |
| Deployment   | GitHub Actions → GitHub Pages (static `dist/`)          |

### 2.2 Project Structure

```
cloud-vis/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # ReactFlowProvider wrapper
│   ├── components/
│   │   ├── GraphView.tsx           # Main canvas orchestrator
│   │   ├── CloudServiceNode.tsx    # Leaf service node renderer
│   │   ├── CloudGroupNode.tsx      # Expandable group node renderer
│   │   ├── GatewayNode.tsx         # Ingress/egress gateway indicator
│   │   ├── ZoneNode.tsx            # Nested zone container renderer
│   │   ├── SmartEdge.tsx           # Custom edge with positioned labels
│   │   ├── Breadcrumb.tsx          # Navigation breadcrumb trail
│   │   ├── InfoPanel.tsx           # Node detail side panel
│   │   ├── DepthControl.tsx        # Zone depth slider
│   │   └── EdgeLegend.tsx          # Edge category color legend
│   ├── data/
│   │   ├── graph-data.ts           # All nodes, edges, and the graph registry
│   │   └── providers.ts            # Provider configs and category color palette
│   ├── hooks/
│   │   └── useGraphNavigation.ts   # Core state machine (view mode, navigation, selection)
│   ├── types/
│   │   └── index.ts                # Shared TypeScript interfaces
│   └── utils/
│       ├── layout.ts               # Dagre layout for explorer mode
│       ├── zone-layout.ts          # Bottom-up Dagre layout for zone mode
│       ├── graph-flattener.ts      # Recursive flattening of the graph registry
│       ├── edge-styles.ts          # Semantic edge classification and styling
│       └── icons.tsx               # Lucide icon lookup helper
├── index.html
├── vite.config.ts                  # Vite config (base path for GH Pages)
├── tsconfig.json
├── package.json
└── .github/workflows/deploy.yml    # CI/CD pipeline
```

---

## 3. Data Model

### 3.1 Graph Registry

The entire cloud topology is defined as a static **graph registry** — a flat `Record<string, GraphLevel>` where each key maps a node ID to its child graph:

```
registry["root"]          → { nodes: [aws, gcp, azure],       edges: [] }
registry["aws"]           → { nodes: [vpc, iam, eks, ...],    edges: [...] }
registry["aws-eks"]       → { nodes: [control-plane, ...],    edges: [...] }
registry["eks-control-plane"] → { nodes: [api-server, etcd, ...], edges: [...] }
...
```

This structure supports arbitrary depth and is the single source of truth for both view modes.

### 3.2 Node Types

| Type             | React Flow type   | Purpose                                        |
| ---------------- | ----------------- | ---------------------------------------------- |
| Cloud Service    | `cloudService`    | Leaf node representing a single service/concept |
| Cloud Group      | `cloudGroup`      | Expandable node with children in the registry   |
| Gateway Node     | `gatewayNode`     | Ingress/egress traffic indicator                |
| Zone Container   | `zoneContainer`   | Nested container in zone view (uses `parentId`) |

### 3.3 Key Interfaces

```typescript
interface CloudNodeData {
  label: string;
  description: string;
  provider: 'aws' | 'gcp' | 'azure';
  category: string;         // maps to a color via categoryColors
  icon: string;             // Lucide icon name
  isGroup: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  depth: number;
  color: string;
  gatewayType?: 'ingress' | 'egress' | 'both';
}

interface ZoneNodeData {
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
}
```

### 3.4 Edge Classification

Edges are classified into five semantic categories based on their label text:

| Category     | Color   | Examples                                       |
| ------------ | ------- | ---------------------------------------------- |
| Data flow    | Cyan    | DNS, Traffic, Read/Write, Query, Trigger        |
| Control      | Purple  | Manages, Runs, Configures, Watch & update       |
| Monitoring   | Yellow  | Monitors, Checks, Analyzes, Alerts via          |
| Security     | Red     | Auth, Protects, Credentials, Encrypts           |
| Structural   | Gray    | Inside, Contains, Attached to, Provides IPs     |

All edges include directional arrowheads at the target end.

---

## 4. View Modes

### 4.1 Explorer Mode

A drill-down navigational view. Users see one level of the hierarchy at a time and double-click group nodes to descend into child graphs.

**Key behaviors:**
- Dagre auto-layout (top-to-bottom) for each level independently
- Breadcrumb trail for navigation back up the hierarchy
- InfoPanel shows details on node click
- Fit-to-view animation on level transitions
- Spread handle positions across node width to reduce edge crossing

**Layout pipeline:**
1. Look up current level in `graphRegistry`
2. Run Dagre layout (`utils/layout.ts`)
3. Compute per-node handle positions based on connection count
4. Find non-colliding label positions along edge paths (Liang-Barsky intersection test)
5. Apply semantic edge styles

### 4.2 Zone Mode (default)

A birds-eye view showing the entire topology as nested containers. All providers and their services are visible simultaneously.

**Key behaviors:**
- Recursive flattening of the graph registry up to a configurable depth (1–5)
- Nested `parentId` grouping creates visual containment
- Double-click zones to expand/collapse
- Cross-zone edges rendered as animated dashed lines
- Depth slider controls how many levels to expand

**Layout pipeline:**
1. `flattenGraph()` recursively walks the registry, creating zone containers and leaf nodes
2. Bottom-up Dagre layout: leaf zones first, then parent zones using computed child sizes
3. Positions converted to parent-relative coordinates (React Flow requirement)
4. Nodes sorted so parent zones precede children in the array
5. Cross-zone edges detected and styled with dashes + animation

---

## 5. Cloud Coverage

### 5.1 AWS (most detailed)

Top-level services with drill-down internals:

| Service     | Internal detail level                                     |
| ----------- | --------------------------------------------------------- |
| VPC         | Subnets, IGW, NAT, Security Groups, NACLs, Route Tables, VPC Endpoints, Peering, Flow Logs, Transit GW, EIPs, ENIs |
| IAM         | Users, Roles, Policies, Groups, MFA, STS, IdP, Instance Profiles, Permission Boundaries, Access Keys, Access Analyzer |
| EKS         | Control Plane → (API Server, etcd, Scheduler, Controller Manager, Cloud Controller, Admission Controllers), Worker Nodes → (Kubelet, kube-proxy, Container Runtime, Pods → (Containers, Init Containers, Volumes, Secrets, ConfigMaps, Service Account, Probes, Resource Limits), DaemonSets, Node Resources), Cluster Networking → (VPC CNI, CoreDNS, AWS LB Controller, Services, Network Policies), Fargate, Add-ons, Pod Identity |
| EC2         | Instances, AMIs, ASGs, EBS, Security Groups, Key Pairs, Launch Templates, ENIs, EIPs, Instance Store, Placement Groups |
| S3          | Buckets, Objects, Versioning, Lifecycle, Encryption, Bucket Policies, Storage Classes, Event Notifications, Replication |
| RDS         | DB Instances, Read Replicas, Multi-AZ, Snapshots, Automated Backups, Parameter Groups, Subnet Groups, RDS Proxy, Performance Insights |
| Lambda      | Functions, Layers, Event Sources, Destinations, Reserved/Provisioned Concurrency, Versions & Aliases, Env Vars, VPC Config, DLQ |
| CloudWatch  | Metrics, Alarms, Composite Alarms, Logs, Logs Insights, Dashboards, Anomaly Detection, Container Insights, Synthetics |
| Route 53    | Hosted Zones, Record Sets, Health Checks, Routing Policies, Resolver, DNS Firewall |
| ELB         | ALB, NLB, GWLB, Target Groups, Listeners, Health Checks, Listener Rules |
| SQS         | Standard Queues, FIFO Queues, DLQ, Visibility Timeout, Long Polling, Message Attributes |
| SNS         | Standard Topics, FIFO Topics, Subscriptions, Message Filtering, DLQ |
| EventBridge | (leaf node, no drill-down yet) |

### 5.2 GCP

Top-level services: VPC Network, Cloud IAM, GKE, Compute Engine, Cloud Storage, Cloud SQL, Cloud Functions, Cloud Monitoring, Cloud DNS, Cloud Load Balancing, Pub/Sub, BigQuery.

Drill-down available for: GKE (Control Plane, Node Pools, Networking — each with internal components).

### 5.3 Azure

Top-level services: Virtual Network, Entra ID, AKS, Virtual Machines, Blob Storage, Azure SQL, Azure Functions, Azure Monitor, Azure DNS, Load Balancer, Service Bus, Cosmos DB.

Drill-down available for: AKS (Control Plane, Node Pools, Networking — each with internal components).

---

## 6. UI Components

### GraphView (`components/GraphView.tsx`)
The main orchestrator. Renders the React Flow canvas, toolbar (view mode toggle, depth slider), header (breadcrumb + level info), InfoPanel, EdgeLegend, and hint text. Manages `useNodesState` / `useEdgesState` and wires up click/double-click handlers.

### Custom Node Components
- **CloudServiceNode** — Rounded card with icon, label, and provider color accent
- **CloudGroupNode** — Larger card with expand indicator; visually distinct from leaf nodes
- **GatewayNode** — Directional indicator (ingress/egress arrows)
- **ZoneNode** — Transparent container with colored header bar; children render inside

### SmartEdge
Custom edge component that supports positioned labels (avoiding edge-label intersection with unrelated edges) and semantic coloring.

### InfoPanel
Slide-out panel showing node details (name, description, provider, category) with a "Drill Down" action when children exist.

### EdgeLegend
Floating legend mapping edge colors to their semantic categories.

### DepthControl
Slider controlling how many hierarchy levels to expand in zone mode (1–5).

---

## 7. Layout Algorithms

### 7.1 Explorer Layout (`utils/layout.ts`)

Single-level Dagre layout with edge routing optimizations:

1. **Handle spreading** — Multiple connections to a single node are spread across 20%–80% of the node width, sorted by target position to minimize crossings
2. **Label collision avoidance** — For each labeled edge, tests 7 candidate positions (t = 0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85) along the path and picks the first that doesn't intersect any other edge's path segments using Liang-Barsky rectangle-segment intersection

### 7.2 Zone Layout (`utils/zone-layout.ts`)

Bottom-up nested Dagre:

1. Identify all zone containers and build parent-child tree
2. Process leaf zones first (zones whose children are all leaf nodes)
3. Run Dagre on each zone's children using known sizes
4. Compute zone bounding box (content + padding + header)
5. Move up to parent zone, using computed child zone sizes
6. Repeat until root-level nodes are laid out
7. Convert all positions to parent-relative coordinates

---

## 8. State Management

All state lives in the `useGraphNavigation` hook:

| State            | Type              | Purpose                                       |
| ---------------- | ----------------- | --------------------------------------------- |
| `viewMode`       | `'zone' \| 'explorer'` | Which view is active                     |
| `currentLevel`   | `string`          | Registry key for the current explorer level    |
| `selectedNodeId` | `string \| null`  | Currently inspected node (InfoPanel)           |
| `zoneDepth`      | `number`          | How deep to expand in zone mode (1–5)          |
| `collapsedZones` | `Set<string>`     | Zones the user has manually collapsed          |

No external state management library is used — React's built-in `useState` + `useMemo` + `useCallback` handles all state derivation and memoization.

---

## 9. Deployment

- **Build:** `tsc -b && vite build` → static output in `dist/`
- **Base path:** `/cloud-vis/` (configured in `vite.config.ts`)
- **CI/CD:** GitHub Actions workflow triggers on push to `main`
  1. Checkout → setup Node 20 → `npm ci` → `npm run build`
  2. Upload `dist/` as Pages artifact
  3. Deploy to GitHub Pages environment

---

## 10. Future Considerations

Areas identified for potential future work (not yet planned):

- **GCP/Azure parity** — Add drill-down internals for GCP and Azure services matching AWS depth (VPC, IAM, Storage, Database, Serverless, Monitoring sub-services)
- **Search** — Find and navigate to a specific service across the full hierarchy
- **Live data import** — Connect to cloud APIs (AWS Config, GCP Asset Inventory, Azure Resource Graph) to generate graphs from real infrastructure
- **Custom annotations** — Let users add notes, tags, or highlights to nodes
- **Export** — SVG/PNG export of the current view
- **Terraform/IaC mapping** — Show which Terraform resources map to which visual nodes
- **Performance** — Virtualization for very large graphs; web worker layout computation
- **Testing** — Unit tests for layout utilities and edge classification; component tests for node renderers

---

## Appendix A: Category Color Palette

| Category       | Hex       | Usage                        |
| -------------- | --------- | ---------------------------- |
| compute        | `#F97316` | EC2, Compute Engine, VMs     |
| networking     | `#8B5CF6` | VPC, Load Balancers, DNS     |
| storage        | `#10B981` | S3, Blob, Cloud Storage      |
| database       | `#3B82F6` | RDS, SQL, BigQuery           |
| containers     | `#06B6D4` | Pod internals                |
| security       | `#EF4444` | IAM, Entra ID, Guards        |
| kubernetes     | `#326CE5` | EKS, GKE, AKS               |
| control-plane  | `#7C3AED` | K8s control plane components |
| worker-node    | `#059669` | K8s worker node components   |
| monitoring     | `#F59E0B` | CloudWatch, Monitoring       |
| serverless     | `#EC4899` | Lambda, Functions            |
| messaging      | `#F97316` | SQS, SNS, Pub/Sub, Service Bus |

## Appendix B: Provider Colors

| Provider | Primary   | Gradient                           |
| -------- | --------- | ---------------------------------- |
| AWS      | `#FF9900` | `#FF9900` → `#FF6600`             |
| GCP      | `#4285F4` | `#4285F4` → `#34A853`             |
| Azure    | `#0078D4` | `#0078D4` → `#50E6FF`             |
