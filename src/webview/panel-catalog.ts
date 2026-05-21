/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* ARCHIVED: Awesome Copilot Catalog fetcher
 *
 * This module fetched skills/agents/instructions/hooks from awesome-copilot.github.com
 * by scraping its HTML catalog pages. The data was then triaged against the developer's
 * workflow patterns via the LLM to surface relevant matches.
 *
 * It was archived when the community catalog feature was replaced with LLM-generated
 * Claude Code suggestions (see panel-request-service.ts → handleSuggestClaudeSkills).
 *
 * Reasons for archival:
 *   - awesome-copilot items are GitHub Copilot-specific (SKILL.md, .github/agents/, etc.)
 *     and are not applicable to Claude Code users
 *   - The two-phase fetch+triage flow added latency and an external network dependency
 *   - Direct LLM generation produces more relevant, actionable Claude Code customizations
 *
 * TODO: Restore (or replace) this module when an official Claude Code marketplace or
 * community catalog exists. The catalog UI shell in page-skills.ts and the RPC types in
 * rpc-types.ts are preserved with ARCHIVED comments for this reason.
 *
 * Original implementation preserved below.
 */

// ----- ARCHIVED TYPES (kept for reference) -----

/** @deprecated Archived — kept for reference only. */
export interface RawCatalogItem {
  kind: 'skill' | 'agent' | 'instruction' | 'hook';
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  url: string;
}

// ----- ARCHIVED IMPLEMENTATION -----

/*
export const CATALOG_BASE = 'https://awesome-copilot.github.com';

let catalogCache: RawCatalogItem[] | undefined;
let catalogPromise: Promise<RawCatalogItem[]> | undefined;

function stripHtml(text: string): string {
  let prev = text;
  while (true) {
    const next = prev.replaceAll(/<[^>]*>/g, '');
    if (next === prev) return next;
    prev = next;
  }
}

async function fetchCatalogPage(slug: string, kind: RawCatalogItem['kind']): Promise<RawCatalogItem[]> {
  const url = `${CATALOG_BASE}/${slug}/`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const html = await response.text();

  const items: RawCatalogItem[] = [];
  const articleRegex = /<article\s+class="resource-item"[^>]*data-path="([^"]*)"[^>]*>([\s\S]*?)<\/article>/g;
  let match: RegExpExecArray | null;
  while ((match = articleRegex.exec(html)) !== null) {
    const path = match[1];
    const block = match[2];
    const titleMatch = block.match(/<div class="resource-title">([^<]*)<\/div>/);
    const descMatch = block.match(/<div class="resource-description">([\s\S]*?)<\/div>/);
    const categoryMatch = block.match(/tag-category">([^<]*)</);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const description = descMatch ? stripHtml(descMatch[1].trim()) : '';
    const category = categoryMatch ? categoryMatch[1].trim() : '';
    if (!title) continue;
    items.push({
      kind, id: `${kind}:${path}`, title, description, category, path,
      url: `${CATALOG_BASE}/${slug}/#${path.split('/').pop()?.replace(/\.[^.]+$/, '') || ''}`,
    });
  }
  return items;
}

export async function getCatalogItems(): Promise<RawCatalogItem[]> {
  if (catalogCache) return catalogCache;
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const [skills, agents, instructions, hooks] = await Promise.all([
        fetchCatalogPage('skills', 'skill'),
        fetchCatalogPage('agents', 'agent'),
        fetchCatalogPage('instructions', 'instruction'),
        fetchCatalogPage('hooks', 'hook'),
      ]);
      catalogCache = [...skills, ...agents, ...instructions, ...hooks];
      catalogPromise = undefined;
      return catalogCache;
    })();
  }
  return catalogPromise;
}

export function clearCatalogCache(): void {
  catalogCache = undefined;
  catalogPromise = undefined;
}
*/
