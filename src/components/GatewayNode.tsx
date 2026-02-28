import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ArrowDownToLine, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import type { CloudNodeData, GatewayType } from '../types';

const gatewayConfig: Record<GatewayType, {
  Icon: typeof ArrowDownToLine;
  color: string;
  bgColor: string;
  label: string;
}> = {
  ingress: {
    Icon: ArrowDownToLine,
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    label: 'INGRESS',
  },
  egress: {
    Icon: ArrowUpRight,
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    label: 'EGRESS',
  },
  both: {
    Icon: ArrowLeftRight,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    label: 'IN/OUT',
  },
};

function GatewayNode({ data }: NodeProps) {
  const nodeData = data as unknown as CloudNodeData;
  const gwType = nodeData.gatewayType ?? 'both';
  const config = gatewayConfig[gwType];

  return (
    <div
      className="gateway-node"
      style={{
        '--gw-color': config.color,
        '--gw-bg': config.bgColor,
      } as React.CSSProperties}
    >
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="gateway-content">
        <div className="gateway-icon">
          <config.Icon size={14} />
        </div>
        <div className="gateway-info">
          <span className="gateway-label">{nodeData.label}</span>
          <span className="gateway-type">{config.label}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}

export default memo(GatewayNode);
