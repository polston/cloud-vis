import { edgeCategoryColors, edgeCategoryLabels, type EdgeCategory } from '../utils/edge-styles';

const categories: EdgeCategory[] = ['data-flow', 'control', 'monitoring', 'security', 'structural'];

function ArrowLine({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <svg width="28" height="10" viewBox="0 0 28 10" style={{ flexShrink: 0 }}>
      <line
        x1="0"
        y1="5"
        x2="20"
        y2="5"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? '4 2' : undefined}
      />
      <polygon points="18,2 24,5 18,8" fill={color} />
    </svg>
  );
}

function PlainLine({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <svg width="28" height="10" viewBox="0 0 28 10" style={{ flexShrink: 0 }}>
      <line
        x1="0"
        y1="5"
        x2="24"
        y2="5"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? '4 2' : undefined}
      />
    </svg>
  );
}

export default function EdgeLegend({ isZoneMode }: { isZoneMode: boolean }) {
  return (
    <div className="graph-legend">
      <div className="legend-section-title">Edges</div>
      {categories.map((cat) => (
        <div key={cat} className="graph-legend-item">
          {cat === 'structural' ? (
            <PlainLine color={edgeCategoryColors[cat]} />
          ) : (
            <ArrowLine color={edgeCategoryColors[cat]} />
          )}
          <span>{edgeCategoryLabels[cat]}</span>
        </div>
      ))}
      {isZoneMode && (
        <>
          <div className="legend-section-title legend-section-gap">Zones</div>
          <div className="graph-legend-item">
            <ArrowLine color="#94A3B8" dashed />
            <span>Cross-zone</span>
          </div>
          <div className="graph-legend-item">
            <span className="legend-dot" style={{ borderColor: '#22C55E', background: 'rgba(34,197,94,0.2)' }} />
            <span>Ingress</span>
          </div>
          <div className="graph-legend-item">
            <span className="legend-dot" style={{ borderColor: '#F97316', background: 'rgba(249,115,22,0.2)' }} />
            <span>Egress</span>
          </div>
        </>
      )}
    </div>
  );
}
