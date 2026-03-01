import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import { fuzzySearch, type SearchIndexEntry } from '../utils/search-index';
import { getIcon } from '../utils/icons';

interface SearchDropdownProps {
  onSelect: (entry: SearchIndexEntry) => void;
}

export default function SearchDropdown({ onSelect }: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = fuzzySearch(query);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const handleSelect = useCallback(
    (entry: SearchIndexEntry) => {
      onSelect(entry);
      close();
    },
    [onSelect, close]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    // Focus input on next tick after render
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[activeIndex] as HTMLElement | undefined;
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    },
    [results, activeIndex, handleSelect, close]
  );

  const providerLabel = (p: string) => p.toUpperCase();

  if (!isOpen) {
    return (
      <button className="search-trigger-btn" onClick={handleOpen} title="Search nodes (categories & services)">
        <Search size={14} />
        <span>Search</span>
      </button>
    );
  }

  return (
    <div className="search-dropdown" ref={containerRef}>
      <div className="search-input-wrapper">
        <Search size={14} className="search-input-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search services, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />
        <button className="search-close-btn" onClick={close} title="Close search">
          <X size={14} />
        </button>
      </div>

      {query.trim() && (
        <div className="search-results" ref={listRef}>
          {results.length === 0 ? (
            <div className="search-no-results">No results found</div>
          ) : (
            results.map((entry, i) => (
              <button
                key={entry.nodeId}
                className={`search-result-item ${i === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelect(entry)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="search-result-icon" style={{ color: entry.color, background: `${entry.color}20` }}>
                  {getIcon(entry.icon, { size: 14 })}
                </span>
                <div className="search-result-info">
                  <div className="search-result-label">
                    {entry.label}
                    {entry.isGroup && <ChevronRight size={12} className="search-group-indicator" />}
                  </div>
                  <div className="search-result-desc">{entry.description}</div>
                </div>
                <span className="search-result-provider" data-provider={entry.provider}>
                  {providerLabel(entry.provider)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
