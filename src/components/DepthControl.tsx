import { Layers, Minus, Plus } from 'lucide-react';

interface DepthControlProps {
  depth: number;
  maxDepth: number;
  onChange: (depth: number) => void;
}

export default function DepthControl({ depth, maxDepth, onChange }: DepthControlProps) {
  return (
    <div className="depth-control">
      <div className="depth-label">
        <Layers size={13} />
        <span>Depth</span>
      </div>
      <div className="depth-buttons">
        <button
          className="depth-btn"
          disabled={depth <= 0}
          onClick={() => onChange(Math.max(0, depth - 1))}
          title="Show fewer levels"
        >
          <Minus size={12} />
        </button>
        <span className="depth-value">{depth}</span>
        <button
          className="depth-btn"
          disabled={depth >= maxDepth}
          onClick={() => onChange(Math.min(maxDepth, depth + 1))}
          title="Show more levels"
        >
          <Plus size={12} />
        </button>
      </div>
      <input
        type="range"
        className="depth-slider"
        min={0}
        max={maxDepth}
        value={depth}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
