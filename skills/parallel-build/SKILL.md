---
description: Run several agents in parallel on one codebase without them colliding, then integrate their work into one clean, linear branch. Covers splitting work by file ownership, worktrees, a shared lock for heavy commands, a common brief every agent gets, cherry-picking results, reconciling two agents who solved the same problem two ways, a gardener pass and one final full verification. Use when there are three or more independent fixes or features to land quickly, or when the user says "knock out all of these", "do them in parallel", "fan out".
argument-hint: "[list of work items]"
---

# Parallel build

## 1. Split by ownership, not by topic
- Write the list of work items. For each, name the files it will touch.
- Two items that must change the same file (a schema, a migration, a shared form helper) go to one agent, or the second waits.
- Only one agent may add a database migration per round. Say which one in every brief.
- Keep the formatter, the load test and the final verification for yourself, after integration.

## 2. One shared brief, pasted into every agent
- Read CLAUDE.md and the brief first; obey the banned list and the paved path.
- Install dependencies in the worktree (do not symlink node_modules; some bundlers refuse symlinks that leave the root).
- Fast checks any time: lint, typecheck, unit.
- Heavy commands share one database, fixed ports and file storage, so wrap them in a lock: `flock /tmp/<project>-heavy.lock -c '<command>'`. Never hold it for more than one command.
- Commits: small, one concern each, plain-language subject, short why-body, the session's attribution trailers.
- Do not push, merge or rebase. Stay in scope; name any shared file you had to touch.
- Before finishing: lint, typecheck, full tests, e2e and the relevant verify flows under the lock. Report commits, files, before and after numbers, and what you could not do.

## 3. Launch
- One agent per item, each in its own worktree, all in one message so they run at once.
- Worktrees usually branch from the default branch, not from your working branch. Expect to reconcile your own earlier commits when you integrate.
- Add `.claude/worktrees/` to lint, tsc and git ignores before agents start, or tools in the main checkout will crawl their build output.

## 4. Integrate as each one finishes
- Read the core diff before taking it. Verify the agent's headline claim yourself when it is surprising.
- `git cherry-pick <base>..<agent-branch>` onto your branch, keeping history linear. No merge commits from agent branches.
- Resolve conflicts by keeping both intents. If two agents fixed one problem two ways (say, a session check in every query and in every page), keep the one that is enforced lower on the ladder and remove the other. Rewrite the commit message so it says what actually landed.
- Watch for lint config blocks that restate a rule list and silently drop an earlier ban. Build every block from one helper.
- After each integration: lint, typecheck, unit, integration. Push so nothing is lost.

## 5. Gardener, then one full pass
- Run the gardener agent over the whole integrated diff. Fix what a reviewer or user would see first; push structural fixes up the ladder.
- Last: lint, typecheck, every test, e2e, `verify --all` at both widths, on the exact commit you will ship. Quote the numbers.

## 6. Report
Per item: what changed, the evidence, what is still open. Then the user's own to-do list (secrets to rotate, env vars to set, things only they can record or decide).
