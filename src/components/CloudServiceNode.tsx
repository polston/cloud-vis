import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CloudNodeData } from '../types';
import { getIcon } from '../utils/icons';

function CloudServiceNode({ data }: NodeProps) {
  const nodeData = data as unknown as CloudNodeData;

  return (
    <div
      className="cloud-node service-node"
      style={{
        '--node-color': nodeData.color,
        '--node-color-dim': `${nodeData.color}33`,
      } as React.CSSProperties}
    >
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-content">
        <div className="node-icon">
          {getIcon(nodeData.icon, { size: 20 })}
        </div>
        <div className="node-info">
          <div className="node-label">{nodeData.label}</div>
          <div className="node-description">{nodeData.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}

export default memo(CloudServiceNode);
