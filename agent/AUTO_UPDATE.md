# Keeping This Template Current

This template does not learn on its own with zero input — no agent runs unattended forever. What it has instead is a **scheduled check** that runs on a cadence and proposes updates for your approval. That's the realistic version of "self-updating."

## The mechanism

A weekly scheduled task (set up 2026-06-30) does the following:

1. Checks Anthropic's engineering blog/docs (`anthropic.com/engineering`, `docs.claude.com`, `code.claude.com/docs`) and OpenAI's Codex docs/changelog (`developers.openai.com/codex/changelog`) for anything new: a new primitive (like Skills or Subagents were, when they launched), a new config convention, a notable best-practices change.
2. If it finds something that looks genuinely new and relevant (not just a wording tweak to existing docs), it drafts a proposed new row for `agent/TOOL_REGISTRY.md`'s "Future Tool Slots" table.
3. It reports the proposal to you. **Nothing gets written to the Core Tools table automatically** — you review and decide whether to promote it, per your stated preference (notify, you approve).
4. If you approve, move the row from "Future Tool Slots" to "Core Tools" and fill in the real Setup/Status columns.

## Why this table-based approach, not a live feed

A living document you review beats a fully automatic system for one reason: half of what shows up in AI tooling news is renamed/rebranded versions of things you already have, or vendor marketing for something with no real capability behind it yet. A human approval step is a cheap filter against that noise. If this becomes annoying (too many false positives, or nothing useful shows up for months), tell Claude to change the cadence or turn it off — it's just a scheduled task, not a fixed system.

## Where the actual check runs

This is a Claude/Cowork scheduled task, not something embedded in this repo. To see or change it, ask Claude to list, update, or cancel your scheduled tasks.
