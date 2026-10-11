---
description: Prove a change works with evidence instead of claiming it. Builds the app, starts from freshly seeded data, signs in, drives the user's flow with Playwright at phone (375px) and desktop width, and reports screenshots, console errors, axe findings, Lighthouse scores and request timings. Use before calling any task done, when reproducing a bug, when checking performance or accessibility, or when the user asks "does it work", "verify", "show me".
argument-hint: "[flow name | --all] [--phone] [--load]"
---

# Verify

You do not claim a change works. You show it.

## If the project already has a verify CLI
Look for `.claude/skills/verify/SKILL.md` or a `verify` script in package.json. Use it, follow its flags, and paste its summary. Do not write a one-off script when the CLI can do the job; extend the CLI instead.

## If it does not, build one (once, then reuse it)
Put it at `scripts/verify/cli.ts` with one flow file per feature-map row. Each run must:

1. Recreate a dedicated database and seed it. Reseed the demo data before each width, so phone and desktop start from the same state and one run cannot use up the other's data.
2. Build the app and start it in production mode on its own port.
3. Sign in once through the real sign-in endpoint, reuse the session cookie.
4. Run each step of the flow at 375x812 (mobile) and 1440x900 (desktop).
5. Write evidence to `.verify/<flow>/`:
   - `<NN-step>/phone.png` and `desktop.png`, full page, after animations settle
   - `console.json`: errors and warnings. Any console error fails the run.
   - `axe.json`: accessibility findings (reported, not blocking, unless the project says otherwise)
   - `lighthouse.json` plus HTML reports. Run Lighthouse with the flow's own cookies and local storage, so it measures a signed-in returning user, not a first visit with a tour or login screen.
   - `timings.json`: every request with method, path, status and milliseconds
   - `summary.md`: pass or fail per step and width, in plain words
6. Exit non-zero if any step fails.

Useful flags: `--phone` (one width while iterating), `--skip-build`, `--load` (seed 100,000 extra historical rows once and keep them, then measure the same flows).

## Feature map
`.claude/skills/verify/feature-map.md`: one row per feature with the route, how a user reaches it by click and by keyboard, and what must be true when it works. Lint fails when a page route or flow is missing from it. When a request is vague ("the tile is wrong"), find it in the map first.

## Reading the evidence
- Look at the screenshots, especially phone. Text that overflows, buttons under 44px, a bottom bar covering content, an empty state where data should be.
- Count requests in `timings.json` per route. Many requests to `/things/<id>` that the flow never opened means link prefetching is fanning out per row (Sentry calls it an N+1).
- Lighthouse on a 4-core machine shared with other work moves 3 to 6 points between runs. Compare runs on the same machine, and say so.

## Reporting
Paste `summary.md`. Name every finding in console, axe or Lighthouse you did not fix, with the reason. Quote numbers from the files, never from memory.
