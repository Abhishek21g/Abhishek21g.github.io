# Promote to Template

Use this file during real project work — not at scaffold time, it starts empty.

When you (or Claude/Codex) learn something during this project that would help *any future project*, not just this one, log it here instead of only fixing it locally. This is the return path in the loop: template → project → back into template.

## Rule of thumb

Ask: "would a brand-new, unrelated project also benefit from this?"

- Yes → log it here.
- No, this is specific to this project's stack/domain → it belongs in this project's own `CLAUDE.md`/`AGENTS.md`/`PROJECT_CONTEXT.md` instead, not here.

## Log

Add one entry per lesson. Don't edit the master template directly from inside a project — that happens later, in one batch, with review, via the `harvest-template-lessons` skill run against the template repo.

Use `rudhra learn` at the end of substantial sessions to draft entries. Only add rows the user approves.

| Date | What was learned | Where it should go in the template | Why |
|---|---|---|---|

## Example

Example lesson: Claude kept re-running the full test suite instead of the single changed file's tests, wasting time.

Example destination: `CLAUDE.md` — add "prefer running single tests, not the whole suite."

Example reason: This is a general workflow preference, not specific to this project's stack.
