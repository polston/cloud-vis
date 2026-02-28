import { getSmoothStepPath, BaseEdge, type EdgeProps } from '@xyflow/react';

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
  t: number
): { x: number; y: number } {
  const midY = (sy + ty) / 2;
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
  const [edgePath, defaultLabelX, defaultLabelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const labelOffset = (data as Record<string, unknown> | undefined)?.labelOffset as
    | number
    | undefined;

  let labelX = defaultLabelX;
  let labelY = defaultLabelY;

  if (labelOffset !== undefined && labelOffset !== 0.5) {
    const pt = getPointOnApproxPath(sourceX, sourceY, targetX, targetY, labelOffset);
    labelX = pt.x;
    labelY = pt.y;
  }

  return (
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
  );
}
