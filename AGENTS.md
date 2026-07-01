# Codex Project Instructions

## Mission

Help build this project with small, correct, verified changes. Read the project context before making decisions.

Start by reading:

- `agent/PROJECT_CONTEXT.md`
- `agent/WORKFLOW.md`
- `agent/TOOL_REGISTRY.md`
- relevant source files

## Working Agreements

- Inspect files before editing.
- Prefer existing project patterns over new abstractions.
- Keep edits focused on the current task.
- Do not overwrite user changes.
- Use `rg` for search when available.
- Explain tradeoffs when the path is ambiguous.
- Run relevant verification before finishing.

## Commands

```sh
npm ci
npm run dev
npm run lint
npm run build
```

- `npm run dev` serves the site on port `3001`.
- There is no dedicated test script yet; use `npm run lint`, `npm run build`, and browser verification for UI work.
- Pushing to `main` triggers `.github/workflows/deploy.yml` and publishes `out/` to `gh-pages`, so confirm before pushing/deploying.

## Verification

- Behavior change: run tests.
- Frontend change: run browser or screenshot verification when possible.
- TypeScript/JavaScript change: run lint/typecheck if configured.
- Dependency/config change: run build.
- If a check cannot run, say exactly why.

## Agent Stack

Use the project stack in this order:

1. `PROJECT_CONTEXT.md` for project intent.
2. `AGENTS.md` for Codex behavior.
3. Skills for repeatable workflows.
4. Subagents for parallel research, review, and tests.
5. MCP/tools for external systems.
6. Hooks for deterministic checks.
7. Evals/traces for quality improvement.

## Future Tools

When a new tool, agent, MCP server, plugin, or workflow becomes useful, add it to `agent/TOOL_REGISTRY.md` before relying on it.

## Website Direction

- The live site should be the `2a` interactive OS desktop as the primary and only website interface.
- Do not reintroduce the Claude design-document wrapper, option labels, landing-page sections, or separate blog/gallery page chrome.
- Existing routes should either render the OS shell or be intentionally wired into OS windows.
