/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* ---- AI Skill Triage ---- */
export type TriageVerdict = 'strong' | 'maybe' | 'skip';

export interface TriagedCluster {
  id: string;
  label: string;
  verdict: TriageVerdict;
  reason: string;
  suggestedSkillName: string | null;
}

export interface SkillTriageResult {
  triaged: TriagedCluster[];
}

/* ---- Claude Code Suggestions ---- */

/** Kind of Claude Code customization a suggestion targets. */
export type ClaudeSuggestionKind = 'claude-md' | 'slash-command' | 'hook' | 'mcp-server';

/**
 * An LLM-generated suggestion for a Claude Code customization, derived
 * directly from the developer's repeated workflow patterns.
 */
export interface ClaudeSuggestion {
  id: string;
  kind: ClaudeSuggestionKind;
  /** Short name shown in the card, e.g. "Testing conventions" or "/deploy command" */
  title: string;
  /** One-sentence explanation of what the customization does */
  description: string;
  /** Ready-to-use file content: CLAUDE.md section, slash command .md, hook script, or MCP JSON */
  content: string;
  /** Concrete reason tied to the developer's actual workflow patterns */
  reason: string;
}

export interface ClaudeSuggestResult {
  items: ClaudeSuggestion[];
}

/* ---- ARCHIVED: Awesome Copilot Catalog ----------------------------------------
 *
 * The original implementation fetched skills/agents/instructions/hooks from
 * https://awesome-copilot.github.com, parsed the HTML catalog, and used the LLM
 * to triage matches against the developer's workflow patterns.
 *
 * This was replaced with LLM-generated Claude Code suggestions (above) because:
 *   1. awesome-copilot items are GitHub Copilot-specific and don't apply to Claude Code
 *   2. Direct LLM generation is simpler and produces more relevant, tool-specific output
 *
 * TODO: Restore this feature (or a variant of it) when an official Claude Code
 * marketplace or community catalog exists. The archived RPC handlers are in
 * panel-request-service.ts (handleDiscoverCatalog, handleTriageCatalog, handleInstallCatalogItem)
 * and the catalog fetcher is in panel-catalog.ts.
 *
 * ------------------------------------------------------------------------------- */

/** @deprecated Archived — see comment above. Use ClaudeSuggestion instead. */
export type CatalogItemKind = 'skill' | 'agent' | 'instruction' | 'hook';

/** @deprecated Archived — see comment above. Use ClaudeSuggestion instead. */
export interface CatalogItem {
  kind: CatalogItemKind;
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  url: string;
  relevanceScore: number;
  matchReasons: string[];
}

/** @deprecated Archived — see comment above. */
export interface CatalogDiscoverResult {
  items: CatalogItem[];
  totalScanned: number;
}

/** @deprecated Archived — see comment above. */
export interface CatalogTriageResult {
  items: CatalogItem[];
}
