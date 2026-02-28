import { useCallback, useMemo, useEffect, useRef } from 'react';
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
import { Map, List } from 'lucide-react';

import CloudServiceNode from './CloudServiceNode';
import CloudGroupNode from './CloudGroupNode';
import GatewayNode from './GatewayNode';
import ZoneNode from './ZoneNode';
import SmartEdge from './SmartEdge';
import Breadcrumb from './Breadcrumb';
import InfoPanel from './InfoPanel';
import DepthControl from './DepthControl';
import EdgeLegend from './EdgeLegend';
import { useGraphNavigation, MAX_HIERARCHY_DEPTH } from '../hooks/useGraphNavigation';
import { graphRegistry } from '../data/graph-data';
import type { CloudNodeData, ZoneNodeData } from '../types';

const nodeTypes = {
  cloudService: CloudServiceNode,
  cloudGroup: CloudGroupNode,
  gatewayNode: GatewayNode,
  zoneContainer: ZoneNode,
};

const edgeTypes = {
  smartEdge: SmartEdge,
};

export default function GraphView() {
  const {
    viewMode,
    currentLevelData,
    nodes: layoutedNodes,
    edges: layoutedEdges,
    breadcrumb,
    selectedNodeId,
    zoneDepth,
    navigateTo,
    selectNode,
    toggleZoneCollapse,
    toggleViewMode,
    setZoneDepth,
  } = useGraphNavigation();

  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Allow pinch-to-zoom when the gesture starts on a node.
  //
  // Two issues block multi-touch zoom on nodes:
  //
  // 1) d3-drag on `.react-flow__node` calls stopImmediatePropagation()
  //    on touch events, preventing them from bubbling to d3-zoom on the
  //    renderer. We neutralize this in the capture phase for multi-touch.
  //
  // 2) React Flow adds the `nopan` class to draggable nodes. d3-zoom's
  //    filter (createFilter) checks event.target.closest('.nopan') and
  //    rejects matching events — including multi-touch pinch gestures.
  //    We temporarily remove `nopan` during multi-touch touchstart so
  //    the filter lets the pinch through.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    let pinching = false;

    const handler = (e: TouchEvent) => {
      if (e.touches.length >= 2 && !pinching) {
        pinching = true;
      }

      if (!pinching) return;

      // (1) Neutralize stopImmediatePropagation so event reaches d3-zoom
      e.stopImmediatePropagation = () => {};

      // (2) On touchstart, temporarily strip the nopan class so d3-zoom's
      //     filter accepts the event. Restore it asynchronously after all
      //     handlers have run.
      if (e.type === 'touchstart') {
        const target = e.target as HTMLElement;
        const nopanEl = target.closest('.nopan') as HTMLElement | null;
        if (nopanEl) {
          nopanEl.classList.remove('nopan');
          setTimeout(() => nopanEl.classList.add('nopan'), 0);
        }
      }

      if (e.touches.length === 0) {
        pinching = false;
      }
    };

    el.addEventListener('touchstart', handler, { capture: true });
    el.addEventListener('touchmove', handler, { capture: true });
    el.addEventListener('touchend', handler, { capture: true });
    el.addEventListener('touchcancel', handler, { capture: true });

    return () => {
      el.removeEventListener('touchstart', handler, { capture: true });
      el.removeEventListener('touchmove', handler, { capture: true });
      el.removeEventListener('touchend', handler, { capture: true });
      el.removeEventListener('touchcancel', handler, { capture: true });
    };
  }, []);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fitView({ padding: 0.15, duration: 300 });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [layoutedNodes, fitView]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node) return null;
    return (node.data as unknown as CloudNodeData) ?? null;
  }, [selectedNodeId, nodes]);

  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (viewMode === 'zone') {
        // In zone mode, double-click toggles expand/collapse only on zone containers
        if (node.type === 'zoneContainer') {
          toggleZoneCollapse(node.id);
        }
      } else {
        // Explorer mode: drill down
        const data = node.data as unknown as CloudNodeData;
        if (data.hasChildren && graphRegistry[node.id]) {
          navigateTo(node.id);
        }
      }
    },
    [viewMode, navigateTo, toggleZoneCollapse]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.type !== 'zoneContainer') {
        selectNode(node.id);
      }
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const isZoneMode = viewMode === 'zone';

  return (
    <div className="graph-container">
      <div className="graph-header">
        <div className="graph-header-top">
          {isZoneMode ? (
            <div className="graph-level-info">
              <h2>Cloud Infrastructure</h2>
              <p>Zone graph view &mdash; double-click zones to expand/collapse</p>
            </div>
          ) : (
            <>
              <Breadcrumb items={breadcrumb} onNavigate={navigateTo} />
              {currentLevelData && (
                <div className="graph-level-info">
                  <h2>{currentLevelData.label}</h2>
                  <p>{currentLevelData.description}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="graph-toolbar">
        <button
          className={`view-toggle-btn ${isZoneMode ? 'active' : ''}`}
          onClick={toggleViewMode}
          title={isZoneMode ? 'Switch to Explorer view' : 'Switch to Zone graph'}
        >
          {isZoneMode ? <List size={14} /> : <Map size={14} />}
          <span>{isZoneMode ? 'Explorer' : 'Zones'}</span>
        </button>
        {isZoneMode && (
          <DepthControl
            depth={zoneDepth}
            maxDepth={MAX_HIERARCHY_DEPTH}
            onChange={setZoneDepth}
          />
        )}
      </div>

      <div className="graph-canvas" ref={canvasRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.05}
          maxZoom={2.5}
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
              const data = node.data as unknown as (CloudNodeData | ZoneNodeData);
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
        showDrillDown={viewMode === 'explorer'}
      />

      <EdgeLegend isZoneMode={isZoneMode} />

      <div className="graph-hint">
        {isZoneMode
          ? 'Double-click zones to expand/collapse \u00b7 Drag edges to reposition \u00b7 Scroll or pinch to zoom'
          : 'Double-click a group to drill down \u00b7 Drag edges to reposition \u00b7 Pinch or scroll to zoom'}
      </div>
    </div>
  );
}
