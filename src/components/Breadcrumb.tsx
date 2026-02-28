import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (id: string) => void;
}

export default function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb">
      <button
        className="breadcrumb-item breadcrumb-home"
        onClick={() => onNavigate('root')}
        title="Back to overview"
      >
        <Home size={14} />
      </button>
      {items.map((item, index) => (
        <span key={item.id} className="breadcrumb-segment">
          <ChevronRight size={12} className="breadcrumb-separator" />
          <button
            className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
