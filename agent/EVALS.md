# Evals

Use evals to measure whether your agent setup is getting better.

## Starter Eval Set

Create 10 small tasks that represent real project work:

| ID | Task | Expected Good Behavior | Check |
|---|---|---|---|
| E001 | Explain repo structure | Reads real files before answering | Human review |
| E002 | Fix small bug | Adds minimal patch and test | Test pass |
| E003 | Add UI state | Handles loading/error/empty states | Browser check |
| E004 | Write docs | Matches actual behavior | Human review |
| E005 | Refactor function | No behavior regression | Test pass |
| E006 | Debug failing test | Finds cause before editing | Test pass |
| E007 | Review PR diff | Finds concrete risks | Human review |
| E008 | Add API endpoint | Handles validation/errors | Test pass |
| E009 | Update dependency | Runs build and tests | Build pass |
| E010 | Release note | Precise and not hype-y | Human review |

## Scorecard

Rate each run:

- 0 = failed or hallucinated
- 1 = partially useful
- 2 = correct with minor issues
- 3 = correct, verified, and concise

## Improvement Rule

When an eval fails twice for the same reason, update one of:

- `AGENTS.md`
- `CLAUDE.md`
- a skill
- a hook
- a subagent description
- `TOOL_REGISTRY.md`

If the fix is specific to this project, make the change here directly. If the same failure would plausibly happen in *any* project (not just this one), also log it in `agent/PROMOTE.md` so it gets pulled back into the master template by `harvest-template-lessons` instead of being re-learned from scratch next time.
