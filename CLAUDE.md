# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
npm run build           # Production build via esbuild
npm run watch           # Watch mode for development
npm run package         # Create .vsix for local installation

# Test
npm test                # Run all unit tests (vitest)
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
npm run test:e2e        # Playwright e2e tests

# Single test file
npx vitest run src/core/parser.test.ts

# Quality checks
npm run lint            # ESLint
npm run typecheck       # TypeScript
npm run check           # All checks (typecheck + lint + spellcheck + knip + test)
```

## Architecture

This is a VS Code extension that parses AI coding assistant logs from multiple tools and renders an analysis dashboard. It is **read-only and fully local** — no telemetry, no network calls to analyze user data.

### Three-layer structure

**Extension host** (`src/extension.ts`) — VS Code lifecycle, panel creation, security trust gates for user-supplied rules/metrics, async loading workflows.

**Core analysis engine** (`src/core/`) — Parsing → Analysis → Rules/Metrics pipeline:
- `parser.ts` orchestrates harness-specific parsers (VS Code, Xcode, Claude CLI, Copilot, OpenCode) that extract `Session` objects from local log files
- `analyzer.ts` is a facade over 11 specialized analyzers (`analyzer-dashboard.ts`, `analyzer-consumption.ts`, `analyzer-patterns.ts`, etc.) that produce typed analytics payloads
- `rule-engine.ts` / `rule-loader.ts` / `rule-compiler.ts` implement a custom DSL for anti-pattern detection; builtin rules live in `src/core/rules/*.md`, custom rules go in `.coach/rules/`
- `metric-engine.ts` computes real-time metrics; definitions live in `src/core/metrics/*.md`
- `cache.ts` plus three workers (`warm-up-worker.ts`, `parse-worker.ts`, `cache-write-worker.ts`) offload parsing and I/O off the main thread

**Webview UI** (`src/webview/`) — Preact app communicating with the extension host via an RPC protocol defined in `src/core/types/rpc-types.ts`. Pages (`page-*.ts`) render different analysis views; panels (`panel-*.ts`) handle RPC calls.

### DSL for custom rules

`src/core/dsl/` contains a full custom language (lexer → parser → compiler → interpreter). Rules are markdown files with embedded DSL expressions evaluated against `Session`/`Request` objects. The schema and valid fields are defined in `src/core/types/rule-types.ts`. `safe-regex.ts` validates user-supplied regexes to prevent ReDoS.

### Build pipeline

`esbuild.mjs` produces five bundles from `dist/`: `extension.js`, three worker scripts, and `webview/app.js` (browser IIFE). It also copies rule/metric markdown files and CSS into `dist/`. The webview bundle must stay under the size threshold checked by `npm run check-size`.

### Type system

All cross-boundary types are in `src/core/types/`. Key ones:
- `session-types.ts` — `Session`, `Request`, `ToolConfirmation`
- `rpc-types.ts` — the message protocol between extension host and webview
- `analytics-types.ts` — payloads returned by each analyzer
- `rule-types.ts` / `metric-engine.ts` — DSL rule and metric schemas

### Test layout

Unit tests live alongside source (`src/**/*.test.ts`), E2E tests in `tests/e2e/`. Coverage is enforced at 70% lines/functions/statements and 60% branches, scoped to `src/core/**` (webview and extension entry point are excluded).
