# Cloud Infrastructure Visualizer — Design Document

> **Last updated:** 2026-02-28

## Overview

Cloud-Vis is a static web app that visualizes cloud infrastructure across AWS, GCP, and Azure as an interactive, navigable graph. Users explore services hierarchically — from a multi-cloud overview down to Kubernetes pod internals — via two view modes.

No backend. No live cloud connections. Pure client-side visualization deployed to GitHub Pages.

## Tech Stack

React 19 + TypeScript, Vite, React Flow (`@xyflow/react`), Dagre (auto-layout), Lucide React (icons). Deployed via GitHub Actions to GitHub Pages.

## Data Model

All cloud topology lives in a **graph registry** (`src/data/graph-data.ts`) — a flat map from node ID to `{ label, description, nodes[], edges[] }`:

```
root → [aws, gcp, azure]
  aws → [vpc, iam, eks, ec2, s3, rds, lambda, cloudwatch, route53, elb, sqs, sns, eventbridge]
    aws-eks → [control-plane, worker-nodes, networking, fargate, addons, pod-identity]
      eks-worker-nodes → [kubelet, kube-proxy, container-runtime, pods, daemonsets, ...]
        wn-pods → [containers, init-containers, volumes, secrets, configmaps, ...]
```

This structure is the single source of truth for both view modes. Adding a new service means adding nodes/edges and a registry entry.

### Node types

- **cloudService** — Leaf node (single service/concept)
- **cloudGroup** — Expandable node with children in the registry
- **gatewayNode** — Ingress/egress traffic indicator
- **zoneContainer** — Nested container in zone view

### Edge categories

Edges are auto-classified by label into: **data-flow** (cyan), **control** (purple), **monitoring** (yellow), **security** (red), **structural** (gray). All edges have directional arrowheads.

## View Modes

### Explorer

Drill-down navigation — one hierarchy level at a time. Double-click a group to descend; breadcrumb to go back. Dagre layouts each level independently with handle spreading and label collision avoidance.

### Zone (default)

Birds-eye view with nested containers. The graph registry is recursively flattened to a configurable depth (1–5). Layout runs bottom-up: Dagre lays out leaf zones first, computes their sizes, then lays out parents. Cross-zone edges are dashed and animated.

## State

All state lives in `useGraphNavigation` — view mode, current level, selected node, zone depth, collapsed zones. No external state library.

## Cloud Coverage

- **AWS** — 13 top-level services, all with drill-down internals (VPC, IAM, EKS, EC2, S3, RDS, Lambda, CloudWatch, Route 53, ELB, SQS, SNS). EKS goes 4 levels deep to pod internals.
- **GCP** — 12 top-level services. GKE has drill-down (control plane, node pools, networking).
- **Azure** — 12 top-level services. AKS has drill-down (control plane, node pools, networking).

## Deployment

Push to `main` triggers GitHub Actions: `npm ci` → `tsc -b && vite build` → deploy `dist/` to GitHub Pages. Base path: `/cloud-vis/`.

## Future Considerations

- GCP/Azure service parity with AWS drill-down depth
- Search across the full hierarchy
- Live cloud API import
- SVG/PNG export
- Testing
