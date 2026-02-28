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
  const layoutMidY = edgeData?.midY as number | undefined;
  const userMidY = edgeData?.userMidY as number | undefined;
  const labelOffset = edgeData?.labelOffset as number | undefined;

  const [dragMidY, setDragMidY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startY: number; startMidY: number } | null>(null);
  const { setEdges } = useReactFlow();

  // Priority: drag in progress > user override > layout-computed
  const effectiveMidY = dragMidY ?? userMidY ?? layoutMidY;

  const [edgePath, defaultLabelX, defaultLabelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
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
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { startY: e.clientY, startMidY: midY };
    setIsDragging(true);
  }, [midY]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const deltaY = e.clientY - dragStartRef.current.startY;
    setDragMidY(dragStartRef.current.startMidY + deltaY);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    const finalMidY = dragStartRef.current.startMidY + (e.clientY - dragStartRef.current.startY);
    dragStartRef.current = null;
    setIsDragging(false);
    setDragMidY(null);

    // Commit to edge data
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, userMidY: finalMidY } }
          : edge
      )
    );
  }, [id, setEdges]);

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset to auto position
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id !== id) return edge;
        const { userMidY: _, ...restData } = (edge.data ?? {}) as Record<string, unknown>;
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
        onDoubleClick={onDoubleClick}
      />
    </>
  );
}
