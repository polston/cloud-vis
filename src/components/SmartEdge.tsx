import { useState, useCallback, useRef } from 'react';
import { getSmoothStepPath, BaseEdge, type EdgeProps, useReactFlow } from '@xyflow/react';

/**
 * Given the source/target coordinates of a TB smoothstep edge,
 * return the approximate point at parameter t (0–1) along the
 * three-segment path: down → horizontal → down.
 */
function getPointOnApproxPath(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  t: number,
  customMidY?: number
): { x: number; y: number } {
  const midY = customMidY ?? (sy + ty) / 2;
  const segs = [
    { x1: sx, y1: sy, x2: sx, y2: midY },
    { x1: sx, y1: midY, x2: tx, y2: midY },
    { x1: tx, y1: midY, x2: tx, y2: ty },
  ];

  let totalLen = 0;
  const lens: number[] = [];
  for (const s of segs) {
    const l = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
    lens.push(l);
    totalLen += l;
  }

  const dist = t * totalLen;
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + lens[i] >= dist || i === segs.length - 1) {
      const segT = lens[i] > 0 ? (dist - acc) / lens[i] : 0;
      return {
        x: segs[i].x1 + segT * (segs[i].x2 - segs[i].x1),
        y: segs[i].y1 + segT * (segs[i].y2 - segs[i].y1),
      };
    }
    acc += lens[i];
  }
  return { x: sx, y: sy };
}

export default function SmartEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  label,
  data,
  markerStart,
  markerEnd,
}: EdgeProps) {
  const edgeData = data as Record<string, unknown> | undefined;

  // Layout-computed ratio (0–1 between sourceY and targetY)
  const layoutRelativeMidY = edgeData?.relativeMidY as number | undefined;
  // User-dragged ratio (persisted via setEdges)
  const userRelativeMidY = edgeData?.userRelativeMidY as number | undefined;
  const labelOffset = edgeData?.labelOffset as number | undefined;

  const [dragMidY, setDragMidY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startY: number; startMidY: number } | null>(null);
  const activePointersRef = useRef<Set<number>>(new Set());
  const { setEdges } = useReactFlow();

  // Convert relative ratios to absolute Y using current endpoint positions.
  // This ensures the horizontal segment moves when endpoints move (e.g. zone drag).
  const span = targetY - sourceY;
  const layoutMidY = layoutRelativeMidY !== undefined
    ? sourceY + layoutRelativeMidY * span
    : undefined;
  const userMidY = userRelativeMidY !== undefined
    ? sourceY + userRelativeMidY * span
    : undefined;

  // Priority: drag in progress > user override > layout-computed
  const effectiveMidY = dragMidY ?? userMidY ?? layoutMidY;

  const EDGE_BORDER_RADIUS = 5;

  const [edgePath, defaultLabelX, defaultLabelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: EDGE_BORDER_RADIUS,
    ...(effectiveMidY !== undefined ? { centerY: effectiveMidY } : {}),
  });

  let labelX = defaultLabelX;
  let labelY = defaultLabelY;

  if (labelOffset !== undefined && labelOffset !== 0.5) {
    const pt = getPointOnApproxPath(sourceX, sourceY, targetX, targetY, labelOffset, effectiveMidY);
    labelX = pt.x;
    labelY = pt.y;
  }

  // Compute horizontal segment for drag handle
  const midY = effectiveMidY ?? (sourceY + targetY) / 2;
  const hSegMinX = Math.min(sourceX, targetX);
  const hSegMaxX = Math.max(sourceX, targetX);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    activePointersRef.current.add(e.pointerId);

    // Multi-touch detected: let React Flow handle pinch-to-zoom
    if (activePointersRef.current.size > 1) {
      if (dragStartRef.current) {
        try {
          (e.target as HTMLElement).releasePointerCapture(
            [...activePointersRef.current][0]
          );
        } catch { /* already released */ }
        dragStartRef.current = null;
        setIsDragging(false);
        setDragMidY(null);
      }
      return;
    }

    // Single touch: begin edge drag
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { startY: e.clientY, startMidY: midY };
    setIsDragging(true);
  }, [midY]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;

    // Second finger appeared mid-drag: cancel drag, let React Flow handle pinch
    if (activePointersRef.current.size > 1) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch { /* already released */ }
      dragStartRef.current = null;
      setIsDragging(false);
      setDragMidY(null);
      return;
    }

    const deltaY = e.clientY - dragStartRef.current.startY;
    setDragMidY(dragStartRef.current.startMidY + deltaY);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);

    if (!dragStartRef.current) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { /* already released */ }
    const finalMidY = dragStartRef.current.startMidY + (e.clientY - dragStartRef.current.startY);
    dragStartRef.current = null;
    setIsDragging(false);
    setDragMidY(null);

    // Store as relative ratio so it adapts when endpoints move
    const finalRelative = span !== 0 ? (finalMidY - sourceY) / span : 0.5;

    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, userRelativeMidY: finalRelative } }
          : edge
      )
    );
  }, [id, setEdges, sourceY, span]);

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);
    if (dragStartRef.current) {
      dragStartRef.current = null;
      setIsDragging(false);
      setDragMidY(null);
    }
  }, []);

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset to auto position
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id !== id) return edge;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userRelativeMidY: _discarded, ...restData } = (edge.data ?? {}) as Record<string, unknown>;
        return { ...edge, data: restData };
      })
    );
  }, [id, setEdges]);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={style}
        label={label}
        labelX={labelX}
        labelY={labelY}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      {/* Invisible wider drag handle over horizontal segment */}
      <path
        d={`M ${hSegMinX} ${midY} L ${hSegMaxX} ${midY}`}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'stroke',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onDoubleClick={onDoubleClick}
      />
    </>
  );
}
