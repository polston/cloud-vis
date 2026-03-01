# Cloud Infrastructure Visualizer

Interactive visualization of cloud infrastructure across AWS, GCP, and Azure — including Kubernetes internals (EKS, GKE, AKS).

## Features

- **Multi-cloud**: AWS, Google Cloud, and Azure services
- **Drill-down navigation**: Double-click any group node to explore its internals
- **Kubernetes deep-dive**: Control plane (API server, etcd, scheduler, controller manager), worker nodes (kubelet, kube-proxy, pods), and networking
- **Dark modern UI**: Glowing edges, rounded nodes with icons
- **Draggable nodes**: Rearrange the graph freely
- **Auto-layout**: Dagre-based layout minimizes overlaps and crossings
- **Info panel**: Click any node to see details
- **Breadcrumb navigation**: Always know where you are

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

Push to `main` — the GitHub Actions workflow will build and deploy automatically.

## Tech Stack

- React + TypeScript + Vite
- React Flow ([@xyflow/react](https://reactflow.dev))
- Dagre (auto-layout)
- Lucide React (icons)

---

*This project was built from my phone, just for fun.*
