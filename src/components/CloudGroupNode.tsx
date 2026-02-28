import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ChevronRight } from 'lucide-react';
import type { CloudNodeData } from '../types';
import type { HandleInfo } from '../utils/layout';
import { getIcon } from '../utils/icons';

function CloudGroupNode({ data }: NodeProps) {
  const nodeData = data as unknown as CloudNodeData;
  const sourceHandles = (nodeData.sourceHandles as HandleInfo[] | undefined) ?? [];
  const targetHandles = (nodeData.targetHandles as HandleInfo[] | undefined) ?? [];

  return (
    <div
      className="cloud-node group-node"
      style={{
        '--node-color': nodeData.color,
        '--node-color-dim': `${nodeData.color}33`,
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
          {getIcon(nodeData.icon, { size: 22 })}
        </div>
        <div className="node-info">
          <div className="node-label">{nodeData.label}</div>
          <div className="node-description">{nodeData.description}</div>
        </div>
        {nodeData.hasChildren && (
          <div className="node-drill-indicator">
            <ChevronRight size={16} />
          </div>
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

export default memo(CloudGroupNode);
