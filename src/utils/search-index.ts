import { graphRegistry } from '../data/graph-data';
import { fullParentMap } from './graph-flattener';
import type { CloudProvider } from '../types';

export interface SearchIndexEntry {
  nodeId: string;
  label: string;
  description: string;
  provider: CloudProvider;
  category: string;
  icon: string;
  color: string;
  parentKey: string;
  isGroup: boolean;
  hasChildren: boolean;
}

function buildSearchIndex(): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];
  const seen = new Set<string>();

  for (const [registryKey, level] of Object.entries(graphRegistry)) {
    for (const node of level.nodes) {
      if (seen.has(node.id)) continue;
      seen.add(node.id);

      const data = node.data as Record<string, unknown>;
      entries.push({
        nodeId: node.id,
        label: data.label as string,
        description: data.description as string,
        provider: data.provider as CloudProvider,
        category: data.category as string,
        icon: data.icon as string,
        color: data.color as string,
        parentKey: fullParentMap[node.id] ?? registryKey,
        isGroup: (data.isGroup as boolean) ?? false,
        hasChildren: (data.hasChildren as boolean) ?? false,
      });
    }
  }

  return entries;
}

export const searchIndex: SearchIndexEntry[] = buildSearchIndex();

export function fuzzySearch(query: string, maxResults = 20): SearchIndexEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = trimmed.toLowerCase().split(/\s+/);

  const scored: Array<{ entry: SearchIndexEntry; score: number }> = [];

  for (const entry of searchIndex) {
    const labelLower = entry.label.toLowerCase();
    const descLower = entry.description.toLowerCase();
    const categoryLower = entry.category.toLowerCase();
    const providerLower = entry.provider.toLowerCase();

    let allMatch = true;
    let score = 0;

    for (const token of tokens) {
      const labelStartsWith = labelLower.startsWith(token);
      const labelContains = labelLower.includes(token);
      const descContains = descLower.includes(token);
      const categoryContains = categoryLower.includes(token);
      const providerContains = providerLower.includes(token);

      if (!labelContains && !descContains && !categoryContains && !providerContains) {
        allMatch = false;
        break;
      }

      if (labelStartsWith) score += 100;
      else if (labelContains) score += 50;
      if (descContains) score += 10;
      if (categoryContains) score += 5;
      if (providerContains) score += 3;
    }

    if (allMatch) {
      // Boost groups slightly so categories appear near the top
      if (entry.isGroup) score += 2;
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map((s) => s.entry);
}
