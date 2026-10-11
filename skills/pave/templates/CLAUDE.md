# {{Project name}}

{{One sentence: what it is and who uses it.}} Read `docs/brief.md` before any work; it is the source of truth for scope{{ and scoring}}.

## How we work here

Agents are trusted because the environment makes the right thing the easy thing. In order of preference:

1. Make the mistake impossible (schema constraint, type, single entry point)
2. Catch it with static analysis (lint rule, type check, CI)
3. Guide with rules and skills (this file, `.claude/skills`)
4. Human review, last and least

If you are corrected twice for the same thing, do not just fix it. Move the fix up this list.

The codebase is memory. Agents copy what exists. Never leave a workaround, a TODO, or a second way to do something.

## Locked decisions

| Area | Choice |
|---|---|
| Framework | {{}} |
| Hosting | {{}} |
| Database | {{}} |
| ORM | {{}} |
| Auth | {{}} |
| Files | {{}} |
| UI | {{}} |
| Live updates | {{}} |
| Tests | {{}} |
| Alerts | {{}} |
| Support libraries | {{}} |

Do not add a dependency or a service outside this table without asking.

## The paved path

One way to do each thing. If the path does not fit, stop and say so. Do not invent a second path.

```
{{folder map: domain (pure), db (schema, migrations, seed), server (reads and writes, the only code that touches the db), app (routes), components}}
```

- **Reads:** {{one helper that checks the session before it reads; called for first paint and by the polling route}}
- **Writes:** {{one action helper: validate with a schema, check the session, call the domain, write in one transaction}}
- **State changes:** {{the one function that changes status; nothing else writes that column}}
- **Forms:** one form helper, schema shared between client and server, error messages in plain language.
- **Screens:** every list and tile has designed empty, loading and error states. Use the shared components.
- **Links to one record:** {{the one component that prefetches on hover or focus, not every row on screen}}
- **Destructive actions:** always behind the shared confirm dialog.
- **Money:** integer cents everywhere. Format only at the edge.
- **Time:** stored as `timestamptz`. "Today" means today in `{{APP_TIMEZONE}}`.

## Domain rules

These are enforced twice: in the domain code and by the database.

- {{rule}}

## Banned

- Code comments. If code needs explaining, rename or restructure it.
- `any`, non-null assertions, `@ts-ignore`, disabled lint rules
- Importing the database outside the server layer
- Fetching in `useEffect`
- Secrets in the repo, and secrets in anything sent to the browser. Env vars only, documented in `.env.example`
- Real personal data. All seed data is fake

## Writing

Plain language everywhere: UI text, errors, commit messages, docs. Short sentences. Say what happened and what to do next. Numbers in docs come from a measurement, with the command that produced them.

## Before you say done

Run the verification skill (`.claude/skills/verify`) and attach its evidence. A change without evidence is not done. Then:

```
{{lint && typecheck && test && e2e}}
```

## Commits

Small, one concern each, conventional prefixes (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`). Subjects in plain language that say what changed for the user ("fix: keep the jobs list at its maximum instead of collapsing past 200"). A short body says why. Never squash, never rewrite history.

## Phone first

Design at 375px first, then widen. Every page is checked at phone width by the verification skill.

## Tasks and gates

`docs/tasks.md` has the work, in waves. `docs/gates.md` has the checks between waves.
