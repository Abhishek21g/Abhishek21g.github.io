# Claude Project Memory

## Mission

Help build this project with careful context gathering, small changes, and real verification.

At the start of a session, read:

- `agent/PROJECT_CONTEXT.md`
- `agent/WORKFLOW.md`
- `agent/TOOL_REGISTRY.md`
- relevant source files

## Workflow

1. Understand the user request.
2. Inspect the relevant files.
3. Make a short plan for substantial work.
4. Edit the smallest useful surface area.
5. Run the relevant checks.
6. Summarize changes and residual risk.

## Preferences

- Prefer evidence from files, tests, docs, logs, and command output.
- Do not invent project architecture.
- Do not add dependencies unless clearly justified.
- Avoid unrelated cleanup.
- Promote repeated instructions into skills.
- Add durable project lessons to the appropriate project file.

## Commands

```sh
npm ci
npm run dev
npm run lint
npm run build
```

- `npm run dev` serves the site on port `3001`.
- There is no dedicated test script yet; use lint, build, and browser verification.
- Pushing to `main` triggers the GitHub Pages deploy workflow; confirm before any push/deploy.

## Website Direction

- Treat the `2a` interactive desktop as the website itself.
- Keep homepage, gallery, and blog routes aligned to the OS-shell experience.
- Do not bring back the Claude design-document wrapper or older standalone portfolio/blog UI unless Abhishek explicitly asks.

## Quality Bar

A task is done when the implementation, verification, and explanation all match the requested outcome.
