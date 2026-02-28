import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGraphNavigation } from '../useGraphNavigation';
import { ReactFlowProvider } from '@xyflow/react';
import type { ReactNode } from 'react';

// React Flow hooks require a <ReactFlowProvider> wrapper
function wrapper({ children }: { children: ReactNode }) {
  return ReactFlowProvider({ children });
}

describe('useGraphNavigation – lock / position-override feature', () => {
  // ── Default states ───────────────────────────────────────

  it('zones are locked by default', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    expect(result.current.zonesLocked).toBe(true);
  });

  it('leaf nodes are unlocked by default', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    expect(result.current.nodesLocked).toBe(false);
  });

  // ── Toggle callbacks ─────────────────────────────────────

  it('toggleZonesLocked flips the zone lock state', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });

    act(() => result.current.toggleZonesLocked());
    expect(result.current.zonesLocked).toBe(false);

    act(() => result.current.toggleZonesLocked());
    expect(result.current.zonesLocked).toBe(true);
  });

  it('toggleNodesLocked flips the node lock state', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });

    act(() => result.current.toggleNodesLocked());
    expect(result.current.nodesLocked).toBe(true);

    act(() => result.current.toggleNodesLocked());
    expect(result.current.nodesLocked).toBe(false);
  });

  it('zone and node locks are independent', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });

    // Unlock zones, lock nodes
    act(() => result.current.toggleZonesLocked());
    act(() => result.current.toggleNodesLocked());

    expect(result.current.zonesLocked).toBe(false);
    expect(result.current.nodesLocked).toBe(true);
  });

  // ── Zone container draggable property ────────────────────

  it('zone containers have draggable:false when zones are locked', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    // Default view mode is 'zone', zones are locked by default
    const zoneNodes = result.current.nodes.filter((n) => n.type === 'zoneContainer');
    // There should be zone container nodes in the default zone view
    expect(zoneNodes.length).toBeGreaterThan(0);
    for (const node of zoneNodes) {
      expect(node.draggable).toBe(false);
    }
  });

  it('zone containers have draggable:true when zones are unlocked', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });

    act(() => result.current.toggleZonesLocked());

    const zoneNodes = result.current.nodes.filter((n) => n.type === 'zoneContainer');
    expect(zoneNodes.length).toBeGreaterThan(0);
    for (const node of zoneNodes) {
      expect(node.draggable).toBe(true);
    }
  });

  // ── Leaf node draggable property ─────────────────────────

  it('leaf nodes have draggable:true when nodes are unlocked (default)', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    const leafNodes = result.current.nodes.filter((n) => n.type !== 'zoneContainer');
    expect(leafNodes.length).toBeGreaterThan(0);
    for (const node of leafNodes) {
      expect(node.draggable).toBe(true);
    }
  });

  it('leaf nodes have draggable:false when nodes are locked', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });

    act(() => result.current.toggleNodesLocked());

    const leafNodes = result.current.nodes.filter((n) => n.type !== 'zoneContainer');
    expect(leafNodes.length).toBeGreaterThan(0);
    for (const node of leafNodes) {
      expect(node.draggable).toBe(false);
    }
  });

  // ── Position overrides ───────────────────────────────────

  it('hasPositionOverrides is false initially', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    expect(result.current.hasPositionOverrides).toBe(false);
  });

  it('updateNodePosition stores an override that survives layout recalculation', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    const firstNode = result.current.nodes[0];
    const overridePos = { x: 999, y: 888 };

    act(() => result.current.updateNodePosition(firstNode.id, overridePos));

    // Position override is applied lazily on next layout computation;
    // force a re-render by toggling zones locked (changes memo deps)
    act(() => result.current.toggleZonesLocked());
    act(() => result.current.toggleZonesLocked());

    const updated = result.current.nodes.find((n) => n.id === firstNode.id);
    expect(updated?.position).toEqual(overridePos);
  });

  it('resetPositions clears all overrides and returns to layout positions', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });
    const firstNode = result.current.nodes[0];
    const originalPos = { ...firstNode.position };
    const overridePos = { x: 999, y: 888 };

    act(() => result.current.updateNodePosition(firstNode.id, overridePos));
    act(() => result.current.resetPositions());

    const updated = result.current.nodes.find((n) => n.id === firstNode.id);
    expect(updated?.position).toEqual(originalPos);
  });

  // ── View mode interaction ────────────────────────────────

  it('lock state only applies in zone mode (explorer returns different nodes)', () => {
    const { result } = renderHook(() => useGraphNavigation(), { wrapper });

    // Switch to explorer mode
    act(() => result.current.toggleViewMode());
    expect(result.current.viewMode).toBe('explorer');

    // Explorer nodes don't have draggable explicitly set (React Flow default)
    const explorerNodes = result.current.nodes;
    expect(explorerNodes.length).toBeGreaterThan(0);
    // No zone containers in explorer mode
    const zoneNodes = explorerNodes.filter((n) => n.type === 'zoneContainer');
    expect(zoneNodes.length).toBe(0);
  });
});
