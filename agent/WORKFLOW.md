# Agent Workflow

Use this loop for real project work.

## Default Loop

1. **Context**: Read `PROJECT_CONTEXT.md`, root instructions, and relevant files.
2. **Recon**: Search the repo, docs, tests, logs, or issue context.
3. **Plan**: Pick the smallest complete path.
4. **Execute**: Edit files.
5. **Verify**: Run test, lint, build, browser checks, evals, or manual inspection.
6. **Review**: Use a separate review pass for risky changes.
7. **Capture**: Update context, skills, or registry if something should persist in *this* project. If it's reusable enough to help any future project, log it in `agent/PROMOTE.md` instead — that's what `harvest-template-lessons` reads later to improve the master template.
8. **Learn**: For substantial sessions, run the `rudhra-learn` skill. Draft candidate learnings, ask for approval, then save only approved items.

## When To Use Subagents

Use subagents when work can be split cleanly:

- one agent maps the code
- one agent checks docs
- one agent runs tests
- one agent reviews the final diff

Keep the main agent responsible for decisions and final integration.

For larger tasks, use `rudhra-swarm` and follow `agent/ORCHESTRATION.md`.

## When To Create A Skill

Create a skill when:

- you repeat a workflow more than twice
- the workflow has a checklist
- the workflow needs scripts, examples, or templates
- the instruction is too long for `AGENTS.md` or `CLAUDE.md`

## When To Add A Hook

Use hooks for deterministic checks:

- format
- lint
- test
- typecheck
- secret scan
- dependency audit

Hooks should enforce what should not depend on model judgment.
