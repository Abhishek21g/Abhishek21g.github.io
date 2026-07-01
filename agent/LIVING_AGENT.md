# Rudhra Living Agent

This project is the project-start and memory layer. A true living agent is a separate runtime that stays online, keeps memory, schedules work, and coordinates tools.

## Build Our Own Vs Hermes

Hermes Agent is open source and useful as a reference implementation, but Rudhra does not need to depend on it.

What to borrow conceptually:

- persistent profile/identity
- session memory
- skill creation and improvement
- MCP/tool registry
- scheduler/cron
- approval policy for risky actions
- multi-agent roles

What Rudhra should do differently:

- human-approved learning by default
- no silent git commits, pushes, deployments, or master-template edits
- GitHub-backed template as the source of truth
- Claude/Codex-compatible project files

## Laptop Or VPS

| Host | Best For | Tradeoff |
|---|---|---|
| MacBook | Daily coding and interactive Claude/Codex work | Not ideal as always-on server |
| Spare Lenovo/HP laptop | Free always-on experiment machine | Needs power, sleep disabled, stable internet, backups |
| VPS | Best always-on agent brain | Monthly cost, server setup, secrets management |

## Recommended Path

1. Keep MacBook for coding.
2. Use the spare laptop as the first Rudhra living-agent host.
3. Keep all important state in GitHub-backed repos, not only local disk.
4. Add a VPS later if the spare laptop proves useful but inconvenient.

## Minimum Host Requirements

- can stay plugged in
- sleep disabled
- stable network
- GitHub CLI authenticated
- Claude/Codex/Hermes-like runtime or custom Rudhra process
- encrypted disk if storing keys
- regular git push/backup of approved skills and memory

## First Rudhra Runtime Shape

Start simple:

```text
rudhra daemon
-> watches projects registered in PROJECTS.md
-> reminds for rudhra learn at session end
-> summarizes approved learnings
-> opens PRs/patches to agent-project-template
```

Implemented first version:

- `bin/rudhra-daemon`
- `bin/rudhra-remember`
- `scripts/rudhra_daemon.py`
- `agent/DAEMON.md`

Do not start with full autonomy. Start with reminders, summaries, and approval-gated PRs.
