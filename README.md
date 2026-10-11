# agent-helpers

This repo is a Claude Code plugin marketplace. Its first plugin is **paved-path**.

## paved-path

A Claude Code plugin for building with agents the way Brian Jenney builds: make the right thing the easy thing, prove every change with evidence, and run many agents at once without a mess.

It came out of building Dispatch Lite, a scored dispatch app built mostly by agents in about two days. Everything here is something that build needed.

## What you get

| Command or agent | What it does | Use it when |
|---|---|---|
| `/paved-path:pave` | Sets a repo up for agent work: a CLAUDE.md with the guardrail ladder, locked decisions, one paved path per concern and a banned list; lint rules with failing fixtures; database rules; a verify skill and feature map; task waves and gates | Starting a project, or adopting one for agent work |
| `/paved-path:verify` | Proves a change works: fresh data, real sign-in, Playwright at 375px and desktop, screenshots, console errors, axe, Lighthouse and timings per flow | Before calling anything done |
| `/paved-path:ship-check` | The pre-demo audit: secrets reaching the browser, real access rules, login throttling, demo data that goes stale overnight, prefetch N+1s, error pages, phone layout, speed, load, honest docs | The day before a demo, a review call or a launch |
| `/paved-path:parallel-build` | Splits work across agents by file ownership, shares one lock for heavy commands, cherry-picks results into one linear branch, reconciles duplicate approaches, ends with a gardener pass and one full verification | Three or more independent items to land fast |
| `/paved-path:review-against-brief` | Grades a project against a brief or rubric with one grader per category, verifies their claims, scores out of 5 and ranks fixes | You have a brief and want to know what's left |
| `/paved-path:setup-global` | Adds the starting rules to your global `~/.claude/CLAUDE.md`: paved-path is a must for non-technical founders, offered first on new and contract projects, and left alone otherwise | Once per machine, and after updating the plugin |
| `paved-path:gardener` agent | Finds patterns that would spread if copied and pushes each fix up the ladder | After merges, and before each gate |
| `paved-path:grader` agent | Strict read-only reviewer for one scoring category | Used by review-against-brief |

## The idea in one list

1. Make the mistake impossible (a database constraint, a type, a single entry point)
2. Catch it with static analysis (a lint rule with a failing fixture)
3. Guide it (CLAUDE.md, a skill)
4. Human review, last and least

Corrected twice for the same thing? Move the fix up the list.

## Install

In any Claude Code session:

```
/plugin marketplace add BrianJenney/agent-helpers
/plugin install paved-path@agent-helpers
```

To turn it on for everyone who opens a project, commit this to the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "agent-helpers": { "source": { "source": "github", "repo": "BrianJenney/agent-helpers" } }
  },
  "enabledPlugins": { "paved-path@agent-helpers": true }
}
```

Then, once per machine, run `/paved-path:setup-global` so every new session knows when to use it. You can also copy `skills/setup-global/global-claude.md` into `~/.claude/CLAUDE.md` by hand.

Cloud sessions do not install plugins from project settings on their own. Install it in the session, or ask an org admin to enable it org-wide.

To try it without installing, clone this repo and run `claude --plugin-dir ./agent-helpers`.

## Check it

```
claude plugin validate . --strict
```
