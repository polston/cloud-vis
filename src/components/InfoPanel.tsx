import { X, ExternalLink } from 'lucide-react';
import type { CloudNodeData } from '../types';
import { getIcon } from '../utils/icons';
import { providers } from '../data/providers';

interface InfoPanelProps {
  nodeData: CloudNodeData | null;
  nodeId: string | null;
  onClose: () => void;
  onDrillDown: (id: string) => void;
  showDrillDown?: boolean;
}

export default function InfoPanel({ nodeData, nodeId, onClose, onDrillDown, showDrillDown = true }: InfoPanelProps) {
  if (!nodeData || !nodeId) return null;

  const provider = providers[nodeData.provider];

  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <div className="info-panel-title">
          <div className="info-panel-icon" style={{ color: nodeData.color }}>
            {getIcon(nodeData.icon, { size: 24 })}
          </div>
          <div>
            <h3>{nodeData.label}</h3>
            <span className="info-panel-provider" style={{ color: provider.color }}>
              {provider.label}
            </span>
          </div>
        </div>
        <button className="info-panel-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="info-panel-body">
        <p className="info-panel-description">{nodeData.description}</p>
        <div className="info-panel-meta">
          <span
            className="info-panel-badge"
            style={{ backgroundColor: `${nodeData.color}22`, color: nodeData.color }}
          >
            {nodeData.category}
          </span>
        </div>
        {showDrillDown && nodeData.hasChildren && (
          <button
            className="info-panel-drill-btn"
            onClick={() => onDrillDown(nodeId)}
          >
            <ExternalLink size={14} />
            Explore internals
          </button>
        )}
      </div>
    </div>
  );
}
