import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CloudServiceNode from './CloudServiceNode';
import CloudGroupNode from './CloudGroupNode';
import Breadcrumb from './Breadcrumb';
import InfoPanel from './InfoPanel';
import { useGraphNavigation } from '../hooks/useGraphNavigation';
import { graphRegistry } from '../data/graph-data';
import type { CloudNodeData } from '../types';
import { useEffect } from 'react';

const nodeTypes = {
  cloudService: CloudServiceNode,
  cloudGroup: CloudGroupNode,
};

export default function GraphView() {
  const {
    currentLevelData,
    nodes: layoutedNodes,
    edges: layoutedEdges,
    breadcrumb,
    selectedNodeId,
    navigateTo,
    selectNode,
  } = useGraphNavigation();

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Sync layouted nodes/edges when navigation changes
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // Center and fit the graph after navigating to a new level
  useEffect(() => {
    // Wait for nodes to render before fitting the view
    const timeoutId = setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [layoutedNodes, fitView]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = nodes.find((n) => n.id === selectedNodeId);
    return (node?.data as unknown as CloudNodeData) ?? null;
  }, [selectedNodeId, nodes]);

  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const data = node.data as unknown as CloudNodeData;
      if (data.hasChildren && graphRegistry[node.id]) {
        navigateTo(node.id);
      }
    },
    [navigateTo]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="graph-container">
      <div className="graph-header">
        <Breadcrumb items={breadcrumb} onNavigate={navigateTo} />
        {currentLevelData && (
          <div className="graph-level-info">
            <h2>{currentLevelData.label}</h2>
            <p>{currentLevelData.description}</p>
          </div>
        )}
      </div>

      <div className="graph-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#1e293b"
          />
          <Controls
            showInteractive={false}
            className="graph-controls"
          />
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as unknown as CloudNodeData;
              return data?.color ?? '#475569';
            }}
            maskColor="rgba(0, 0, 0, 0.7)"
            className="graph-minimap"
          />
        </ReactFlow>
      </div>

      <InfoPanel
        nodeData={selectedNodeData}
        nodeId={selectedNodeId}
        onClose={() => selectNode(null)}
        onDrillDown={navigateTo}
      />

      <div className="graph-hint">
        Double-click a group node to drill down &middot; Click to inspect &middot; Drag to rearrange
      </div>
    </div>
  );
}
