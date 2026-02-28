import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ZoneNodeData } from '../types';
import { getIcon } from '../utils/icons';
import { providers } from '../data/providers';

function ZoneNode({ data }: NodeProps) {
  const d = data as unknown as ZoneNodeData;
  const provider = providers[d.provider];

  const depthColors = [
    'rgba(255,255,255,0.06)',
    'rgba(255,255,255,0.04)',
    'rgba(255,255,255,0.03)',
    'rgba(255,255,255,0.02)',
  ];
  const bgColor = depthColors[Math.min(d.zoneLevel, depthColors.length - 1)];

  const borderOpacity = Math.max(0.12, 0.25 - d.zoneLevel * 0.05);

  return (
    <div
      className="zone-node"
      style={{
        width: '100%',
        height: '100%',
        background: bgColor,
        borderRadius: d.zoneLevel === 0 ? 16 : 12,
        border: `1px solid ${d.color}${Math.round(borderOpacity * 255).toString(16).padStart(2, '0')}`,
        borderTop: `3px solid ${d.color}${Math.round(Math.min(borderOpacity * 2, 0.6) * 255).toString(16).padStart(2, '0')}`,
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="zone-handle"
        style={{ top: -4 }}
      />
      <div className="zone-header" style={{ borderBottom: `1px solid ${d.color}15` }}>
        <div className="zone-header-left">
          <div
            className="zone-icon"
            style={{ background: `${d.color}20`, color: d.color }}
          >
            {getIcon(d.icon, { size: 14 })}
          </div>
          <div className="zone-label-group">
            <span className="zone-label" style={{ color: d.color }}>
              {d.label}
            </span>
            <span className="zone-provider" style={{ color: provider.color }}>
              {d.provider.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="zone-header-right">
          <span className="zone-count">{d.childCount}</span>
          {d.isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="zone-handle"
        style={{ bottom: -4 }}
      />
    </div>
  );
}

export default memo(ZoneNode);
