# Rudhra Learning Loop

Rudhra learns through human-approved memory, not silent self-editing.

## Loop

```text
session/message
-> candidate learnings
-> human approval
-> project memory or PROMOTE.md
-> harvest-template-lessons
-> master template improves
-> future projects start smarter
```

## Capture Cadence

Use `rudhra learn`:

- at the end of a project session
- after a repeated mistake
- after discovering a useful command or setup trick
- after clarifying a user preference
- before closing a long thread

For tiny one-message chats, capture only if the lesson is genuinely reusable.

For automatic background review, run `rudhra-daemon`. For session memory, pipe notes into `rudhra-remember` or send them to the daemon API.

## Learning Destinations

| Destination | Use For |
|---|---|
| `agent/PROJECT_CONTEXT.md` | Facts specific to this project |
| `AGENTS.md` | Codex behavior for this project |
| `CLAUDE.md` | Claude behavior for this project |
| `agent/PROMOTE.md` | Reusable lessons for future projects |
| `agent/TOOL_REGISTRY.md` | Tooling discoveries for this project |
| master template | Only after `harvest-template-lessons` and user approval |

## Do Not Save

- secrets, tokens, private keys
- passwords or recovery codes
- private contact/payment details
- temporary guesses
- project-specific hacks as general rules

## Approval Prompt

At the end of substantial work, ask:

```text
I found these possible Rudhra learnings. Which should I keep?
```

List each candidate with:

- lesson
- destination
- reason
