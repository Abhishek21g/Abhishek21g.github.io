# Rudhra Orchestration

Use this file to decide when to run one agent, a small swarm, or a full review loop.

## Commands

| Phrase | Meaning |
|---|---|
| `rudhra start` | Bootstrap a new or existing project with the standard agent setup |
| `rudhra swarm` | Split work across specialized roles or subagents |
| `rudhra learn` | Capture human-approved session learnings |
| `rudhra harvest` | Pull approved project lessons back into the master template |

## Swarm Sizes

| Size | Roles | Use When |
|---|---|---|
| Small | orchestrator, repo-mapper, reviewer | Understanding a repo or reviewing a small change |
| Medium | small + implementer, test-runner | Most implementation tasks |
| Large | medium + docs-researcher, learning-capturer | Risky, unfamiliar, or long-running work |

## Role Contracts

- `orchestrator`: makes decisions and owns final response.
- `repo-mapper`: finds relevant files, commands, architecture, and risks.
- `docs-researcher`: checks official docs or source-backed references.
- `implementer`: edits files in the smallest complete scope.
- `test-runner`: runs checks and summarizes failures.
- `reviewer`: finds bugs, missing tests, and regressions.
- `learning-capturer`: drafts learnings for approval.

## Rules

- Subagents can advise; the orchestrator integrates.
- Subagents do not deploy, commit, push, or modify the master template.
- Use parallel agents when available; otherwise simulate roles sequentially.
- End substantial sessions with `rudhra learn`.
