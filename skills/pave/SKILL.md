---
description: Set up a repository so agents do the right thing by default. Writes a CLAUDE.md with the guardrail ladder, locked decisions, one paved path per concern and a banned list, adds lint rules with failing fixtures, a gardener agent hookup, a verify skill and feature map, and task waves with gates. Use when starting a new project, adopting an existing one for agent work, or when the user says "pave", "set up the rules", "make this agent-ready".
argument-hint: "[path to brief or one-line goal]"
---

# Pave the path

Agents copy what exists. The goal is a repository where the easy thing and the right thing are the same thing, so nobody has to remember the rules.

## The ladder (everything below hangs on this)

Prefer the highest level that works:

1. **Make the mistake impossible**: a database constraint, a type, a single exported entry point.
2. **Catch it with static analysis**: a lint rule with a failing fixture, a type check, CI.
3. **Guide it**: a line in CLAUDE.md or a skill.
4. **Human review**: last and least.

If the same correction happens twice, move the fix up the ladder instead of fixing it again.

## Steps

### 1. Read before writing
- Read the brief: `$ARGUMENTS`, or `docs/brief.md`, or ask for it. If the work is scored (a test, an RFP, a client acceptance list), copy the scoring rubric into `docs/brief.md` verbatim. It is the source of truth for scope.
- Read what exists: package.json, framework, test setup, CI, existing CLAUDE.md or AGENTS.md. Never overwrite an existing CLAUDE.md. Merge into it and show the diff.

### 2. Lock the decisions
Ask only what the code cannot tell you, at most four questions, with a recommended default for each: framework, database and ORM, auth, file storage, hosting, test stack. Record them in the "Locked decisions" table. Any dependency or service outside that table needs the user's yes.

### 3. Write CLAUDE.md from `templates/CLAUDE.md`
Fill every section for this project. Keep the user's voice: short sentences, plain words, no hedging. The paved path section must name the one file or function for each concern (reads, writes, state changes, forms, screens, destructive actions, money, time). If a concern has two ways today, pick one and list the other as a weed for the gardener.

### 4. Turn the banned list into lint
Copy `templates/eslint-rules/` into the project's `eslint-rules/` and wire them as a local plugin. Then for every rule, the repo's own and the built-in ones you enable:
- add a fixture under `tests/lint/fixtures/` that breaks it,
- add a test that runs ESLint on the fixture and expects the rule id.
A rule without a failing fixture is a rule nobody knows works.

Also enable, where the stack allows: `no-explicit-any`, `no-non-null-assertion`, `ban-ts-comment`, `consistent-type-assertions: never`, `noInlineConfig: true` (so a disable comment cannot switch a rule off), and `no-restricted-imports` layering (pure domain imports nothing with I/O; only the server layer touches the database; app code reads only through the read path). Ignore `.claude/worktrees/**` in lint, tsc and git.

### 5. Put rules in the data, not only the code
For each domain rule that matters (allowed status moves, required fields per state, no double booking, append-only history), add the database version too: check constraints, triggers, exclusion constraints, deferred constraint triggers that require a history row in the same transaction. Write integration tests that prove the database refuses the bad write directly.

### 6. Single entry points
- Every read goes through one helper that checks the session before reading, and lint fails any read exported without it.
- Every write goes through one action helper: session, schema validation, domain call, one transaction.
- Every state change goes through one domain function, and the database refuses anything else.
- Every link to one record goes through one component that prefetches on hover or focus, never every row on screen.

### 7. Evidence, not claims
Install the `verify` skill pattern from this plugin into `.claude/skills/verify/`: a CLI that builds the app, seeds a fresh database, signs in, drives each flow with Playwright at 375px and desktop, and writes screenshots, console errors, axe, Lighthouse and timings per flow. Add `feature-map.md`: one row per feature with route, how a user gets there by click and by keyboard, and what is true when it works. Lint fails if a route is missing from the map.

### 8. Waves and gates
Write `docs/tasks.md` (work in waves, one agent per task, file ownership stated so parallel agents do not collide) and `docs/gates.md` (checkboxes between waves: all checks green, verify --all evidence attached, gardener run, docs match measurements).

### 9. Hand back
Show the user what was added, which rules are enforced at which ladder level, and the one command that proves it all: lint, typecheck, unit, integration, e2e, verify.

## Templates
- `templates/CLAUDE.md`: the CLAUDE.md skeleton.
- `templates/eslint-rules/`: no-comments, no-fetch-in-effect, no-hardcoded-secrets.
