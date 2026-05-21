<h1 align="center">AI Engineer Coach</h1>

<p align="center">
<strong>better agentic engineering.</strong><br>
Analyze your AI coding assistant usage — any harness, one dashboard.
</p>

<p align="center">
<a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
<img alt="VS Code 1.115+" src="https://img.shields.io/badge/VS%20Code-1.115%2B-007ACC">
</p>

<br>

<p align="center">
  
https://github.com/user-attachments/assets/9f0239bf-20e0-459f-b137-17cce0edd1b2

</p>

---

## What it does

AI Engineer Coach reads your local AI session logs and turns them into actionable insights — no data leaves your machine.

- **Track progress** -- practice scores, weekly trends, daily activity charts
- **Detect anti-patterns** -- 45 rules across prompt quality, session hygiene, code review, tool mastery, and context management
- **Measure output** -- AI-generated code volume by language, workspace, model, and harness
- **Discover skills** -- find repeated prompts and turn them into reusable skills
- **Score context health** — agentic readiness checks, instruction-file audits, workspace context maps

<details>
<summary><strong>Screenshots</strong></summary>
<br>
<p align="center"><img src="assets/screen-timeline.png" alt="Timeline" width="820"></p>
<p align="center"><img src="assets/screen-output.png" alt="Code Output" width="820"></p>
<p align="center"><img src="assets/screen-consumption.png" alt="Premium Request Consumption" width="820"></p>
<p align="center"><img src="assets/screen-patterns-projects.png" alt="Activity Patterns - Projects" width="820"></p>
<p align="center"><img src="assets/screen-patterns-workhours.png" alt="Activity Patterns - Work Hours" width="820"></p>
<p align="center"><img src="assets/screen-antipatterns.png" alt="Anti-Patterns" width="820"></p>
<p align="center"><img src="assets/screen-skill-finder.png" alt="Skill Finder" width="820"></p>
<p align="center"><img src="assets/screen-context-quality.png" alt="Context Quality" width="820"></p>
<p align="center"><img src="assets/screen-context-management.png" alt="Context Management" width="820"></p>
<p align="center"><img src="assets/screen-learning.png" alt="Learning Center" width="820"></p>
<p align="center"><img src="assets/screen-achievements.png" alt="Achievements" width="820"></p>
<p align="center"><img src="assets/screen-sdlc.png" alt="Agentic SDLC" width="820"></p>
<p align="center"><img src="assets/screen-share.png" alt="Share Your Stats" width="820"></p>
</details>

---

## Fork notes

This is a fork of [microsoft/ai-engineering-coach](https://github.com/microsoft/ai-engineering-coach) maintained by SoSafe.

The main divergence from upstream is that the Copilot dependency has been removed. AI features (rule compiler, skill suggestions, context review, quizzes) now use an internal AI service configured via VS Code settings instead of the `vscode.lm` / GitHub Copilot API.

### AI service configuration

After installing the extension, open VS Code settings and configure:

| Setting | Description |
|---------|-------------|
| `aiEngineerCoach.llm.apiKey` | API key for the AI service |
| `aiEngineerCoach.llm.baseUrl` | Base URL of the AI service (e.g. `https://your-ai-service/v1`) |
| `aiEngineerCoach.llm.model` | Model name to use (default: `gpt-5.1`) |
| `aiEngineerCoach.llm.provider` | `openai` or `bedrock` (default: `openai`) |

AI features are only invoked when explicitly triggered by the user (e.g. generating a quiz, reviewing context files). All analytics and parsing remain fully local with no network calls.

---

## Quick Start

```bash
git clone https://github.com/sosafe-labs/ai-engineering-coach.git
cd ai-engineering-coach
npm install
npm run package
```

Then install the `.vsix`:

**macOS / Linux**

```bash
code --install-extension ai-engineer-coach-*.vsix
```

**Windows / PowerShell**

```powershell
code --install-extension (Get-ChildItem . -Filter 'ai-engineer-coach-*.vsix' | Select-Object -First 1).FullName
```

1. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run **AI Engineer Coach: Open Dashboard**
3. Navigate pages from the sidebar, filter by workspace or harness
4. Configure AI settings (see above) to enable AI-powered features

---

## Pages

### Observe

| Page | Description |
|------|-------------|
| **Dashboard** | Practice scores with week-over-week trends, daily activity chart, top workspace stats |
| **Timeline** | Gantt-style session timeline with per-day drill-down and overlap detection |
| **Coding Moments** | Screenshot gallery from AI coding sessions with story reels and workspace filtering |

### Measure

| Page | Description |
|------|-------------|
| **Output** | Generated code volume by language, model usage table *(token breakdown temporarily hidden)* |
| **Burndown** | Monthly AI token budget progress with projections *(temporarily disabled)* |
| **Patterns** | 7×24 activity heatmap and work-life balance signals |

### Improve

| Page | Description |
|------|-------------|
| **Anti-Patterns** | Five practice score cards with severity ratings, concrete actions, and example prompts. 45 editable markdown rules plus a coverage heatmap |
| **Rule Editor** | Create, edit, and tune detection rules visually or as raw markdown. Live-test against your data |
| **Rule Playground** | Interactive REPL for the rule DSL with field browser, function catalog, and metric list |
| **Data Explorer** | Browse session fields, view distributions, run ad-hoc filters |
| **Skill Finder** | Discover repeated prompt patterns and get AI-generated Claude Code customization suggestions (CLAUDE.md snippets, slash commands, hooks, MCP servers) |
| **Context Health** | Overall context score, agentic readiness checklist, workspace context map, AI-powered instruction-file review |

### Level Up

| Page | Description |
|------|-------------|
| **Learning Center** | Personalized quizzes and code-comparison rounds generated from your actual usage |
| **Achievements** | XP-based progression with Bronze → Silver → Gold → Diamond tiers |
| **Agentic SDLC** | How you use AI across the full software-development lifecycle |
| **Share** | Generate a shareable stat card |

---

## Privacy

- **Read-only** — the extension never modifies your session files
- **Local analysis** — all parsing and analytics run entirely on your machine
- **No proprietary telemetry** — the extension does not phone home or collect usage data
- **Optional AI features** — some features (rule compiler, skill suggestions, context review, quizzes) call the configured AI service only when explicitly invoked by the user; no AI calls are made in the background

---

## License

[MIT](LICENSE) — forked from [microsoft/ai-engineering-coach](https://github.com/microsoft/ai-engineering-coach), also MIT.
