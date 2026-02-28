import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CloudNodeData } from '../types';
import type { HandleInfo } from '../utils/layout';
import { getIcon } from '../utils/icons';

const gatewayColors = {
  ingress: '#22C55E',
  egress: '#F97316',
  both: '#3B82F6',
} as const;

const gatewayLabels = {
  ingress: 'IN',
  egress: 'OUT',
  both: 'I/O',
} as const;

function CloudServiceNode({ data }: NodeProps) {
  const nodeData = data as unknown as CloudNodeData;
  const sourceHandles = (nodeData.sourceHandles as HandleInfo[] | undefined) ?? [];
  const targetHandles = (nodeData.targetHandles as HandleInfo[] | undefined) ?? [];
  const gwType = nodeData.gatewayType;

  return (
    <div
      className={`cloud-node service-node${gwType ? ' gateway-service' : ''}`}
      style={{
        '--node-color': nodeData.color,
        '--node-color-dim': `${nodeData.color}33`,
        ...(gwType ? { borderColor: `${gatewayColors[gwType]}44`, borderStyle: 'dashed' as const } : {}),
      } as React.CSSProperties}
    >
      {targetHandles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type="target"
          position={Position.Top}
          className="node-handle"
          style={{ left: `${h.position}%` }}
        />
      ))}
      {targetHandles.length === 0 && (
        <Handle type="target" position={Position.Top} className="node-handle" />
      )}
      <div className="node-content">
        <div className="node-icon">
          {getIcon(nodeData.icon, { size: 20 })}
        </div>
        <div className="node-info">
          <div className="node-label">{nodeData.label}</div>
          <div className="node-description">{nodeData.description}</div>
        </div>
        {gwType && (
          <span
            className="gateway-badge"
            style={{
              background: `${gatewayColors[gwType]}20`,
              color: gatewayColors[gwType],
              borderColor: `${gatewayColors[gwType]}40`,
            }}
          >
            {gatewayLabels[gwType]}
          </span>
        )}
      </div>
      {sourceHandles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type="source"
          position={Position.Bottom}
          className="node-handle"
          style={{ left: `${h.position}%` }}
        />
      ))}
      {sourceHandles.length === 0 && (
        <Handle type="source" position={Position.Bottom} className="node-handle" />
      )}
    </div>
  );
}

export default memo(CloudServiceNode);
