# Tool Registry

Use this file to track current and future agent tools.

Add a tool here before making it part of the normal workflow.

**Last reviewed:** 2026-06-30 (see `agent/AUTO_UPDATE.md` for how this file stays current)

## Core Tools

| Tool | Category | Use When | Setup Needed | Status |
|---|---|---|---|---|
| `AGENTS.md` | Memory (project) | Codex needs durable project instructions | Create at repo root | Active |
| `CLAUDE.md` | Memory (project) | Claude needs durable project instructions | Create at repo root | Active |
| `~/.codex/AGENTS.md` | Memory (global) | Standing preferences across ALL Codex projects | One-time, home dir | Active |
| `~/.claude/CLAUDE.md` | Memory (global) | Standing preferences across ALL Claude sessions | One-time, home dir | Active |
| Claude Projects (claude.ai) | Memory (initiative) | Recurring body of work needs a 200K-token knowledge base + its own chat history | Create project on claude.ai, upload docs | Optional |
| Skills | Workflow | A process repeats more than twice | Add `SKILL.md` files | Active |
| Subagents | Orchestration | Work can be split into research/test/review/implementation | Configure agent descriptions | Active |
| MCP | Tooling | Need GitHub, docs, browser, Figma, Linear, DBs, or internal tools | Add MCP server config | Optional |
| Hooks | Guardrails | Need automatic, no-exceptions checks before/after tool use | Add hook scripts/config | Optional |
| Plugins | Distribution | Want to bundle skills+hooks+subagents+MCP as one installable unit | Package or install from marketplace | Optional |
| Evals | Measurement | Need to know whether agent behavior improved | Create task set and grader (see `EVALS.md`) | Optional |
| Traces | Debugging | Need to inspect agent steps/tool calls | Enable tracing where supported | Optional |
| Structured output (JSON schema / strict tool use) | Reliability | Downstream code needs to parse the agent's answer programmatically | Define schema, request JSON mode or strict tools | Optional |
| Prompt caching | Cost/speed | Same large context (big CLAUDE.md, long doc) reused across many calls | Enable cache_control on stable context blocks (API only) | Optional |
| Extended thinking / reasoning effort | Quality | Task is hard enough that visible step-by-step reasoning helps | Set reasoning/thinking budget per call | Optional |
| Plan mode | Safety | Want Claude to propose an approach before touching files | Built into Claude Code/Cowork, invoke explicitly | Active |
| Compaction / context management | Longevity | Session is running long, context filling up | `/clear` between unrelated tasks, `/compact` for long ones | Active |
| `agent/PROMOTE.md` + `PROJECTS.md` + `harvest-template-lessons` skill | Feedback loop | Want lessons from real project work to improve the master template over time | Already scaffolded; run the skill periodically from the template repo | Active |
| `rudhra-swarm` | Orchestration | Need multiple specialized roles or subagents on one project | Skill + terminal helper | Active |
| `rudhra-learn` | Human-approved learning | Need to capture reusable lessons from a message/session | Skill + terminal helper; writes only with approval | Active |
| `rudhra-daemon` | Living-agent runtime | Need background monitoring, scheduled reviews, session memory, dashboard/API, and PR proposals | Python stdlib daemon + terminal helper | Active |
| `rudhra-remember` | Session memory | Need to save a session note for later review | Terminal helper or daemon API | Active |
| `rudhra-install-service` | Background service | Need Rudhra to stay running after terminal closes | macOS LaunchAgent or Linux systemd user service | Active |
| `rudhra-setup-laptop` | Machine setup | Need to install Rudhra commands and skills on a new laptop/VPS | Requires Git, gh, Python 3 | Active |

## Project Tools

| Tool | Category | Use When | Setup Needed | Status |
|---|---|---|---|---|
| `npm run dev` | Local dev | Need to inspect the portfolio in browser at `http://127.0.0.1:3001` | `npm ci` first | Active |
| `npm run lint` | Verification | Need a JavaScript/TypeScript lint pass | npm dependencies installed | Active |
| `npm run build` | Verification/deploy parity | Need static export validation before a push or deploy | npm dependencies installed | Active |
| GitHub Actions deploy workflow | Deployment | Publishing approved changes to `enaguthi.com` | Push to `main`; workflow deploys `out/` to `gh-pages` | Active |
| Browser/screenshot verification | UI QA | Any visible OS desktop, gallery, image, responsive, or interaction change | Start dev server or use deployed URL | Active |
| Spotify now-playing workflow | Content automation | Updating the public `/spotify/now-playing.json` feed for the OS music card | GitHub Secrets: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Active |
| GitHub activity workflow | Content automation | Updating the public `/live/github-activity.json` feed for the OS contribution graph | Built-in GitHub Actions token; no personal secret required | Active |
| `/ops/` dashboard | Monitoring | Public-safe control room for feed health, workflow links, and agent handoff state | Static Next route plus `/ops/status.json` | Active |

## Future Tool Slots

Genuinely open rows — fill in as real things emerge.

| Tool | Category | What It Does | When To Use | Setup | Owner | Status |
|---|---|---|---|---|---|---|
| [Hermes Agent](https://github.com/nousresearch/hermes-agent) (Nous Research) | Standalone agent runtime | A separate, self-hosted agent — not a Claude/Codex plugin. Wraps whatever LLM backend you choose (Claude, GPT, OpenRouter, local models) with its own closed learning loop: agent-curated memory with periodic nudges, autonomous skill creation that self-improves during use, FTS5 session search + LLM summarization for cross-session recall, Honcho-based user modeling. Has its own CLI, Telegram/Discord/Slack/WhatsApp gateway, cron scheduler, subagents, MCP support, and context files (its AGENTS.md/CLAUDE.md equivalent). Important: this is agentic memory/skill automation, not weight-level model retraining — the underlying LLM itself doesn't get fine-tuned. | If you want an always-on personal agent that keeps its own memory/skills current automatically instead of you hand-maintaining MEMORY.md/TOOL_REGISTRY.md yourself | `curl -fsSL https://hermes-agent.nousresearch.com/install.sh \| bash` (own runtime, runs independently of Claude Code/Codex) | Abhishek | Watch (verified real, not yet installed) |
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

## Decision Rule

Only add a tool to the default workflow if it saves repeated effort, reduces mistakes, improves verification, or gives the agent access to context it cannot otherwise get.

## How This List Stays Current

See `agent/AUTO_UPDATE.md` — a weekly scheduled check proposes additions here; nothing gets added to "Core Tools" without your approval first.
