---
description: Audit a web app before a demo, a review call or a production launch, and fix what a grader or customer would hit in the first ten minutes. Checks secrets reaching the browser, real access rules, login throttling, demo data that goes stale overnight, link prefetch N+1s, designed error pages, phone layout, Lighthouse, load at scale, and whether the docs match what was measured. Use when the user says "demo tomorrow", "production ready", "ship check", "is this ready", or before submitting work.
argument-hint: "[live URL]"
---

# Ship check

Run every check. For each one: what you ran, what you saw, fixed or not. Fix on a branch with one commit per concern, then verify. Never print a secret you find; say where it is and that it must be rotated.

## 1. Secrets
- Build, then search the whole build output (server and client) for the value of every secret and demo password in the env: `grep -rl "<value>" .next` or the framework's equivalent. Expect nothing.
- Fetch the live sign-in page and search its HTML and inline payloads for "password", "secret", "token". Props passed from a server component to a client component are public.
- Anything that was public must be rotated, and rotation must actually take effect: if a seed only sets a password when it creates the user, changing the env var does nothing. Make the deploy apply the new value and end old sessions.
- Make it impossible: keep demo credentials in a module only seeds and tests may import, with a lint ban and a failing fixture.

## 2. Access rules
- Send a forged session cookie to every page and API route. Pages must redirect, APIs must return 401, and no response body may contain seeded data (search it for a seeded name). A layout-only check is not enough: pages render in parallel with layouts.
- Put the check at the data layer: one helper every read must use, enforced by lint.
- Sign-in throttling must sit on the path the login form actually uses. Calling the auth library's server API directly often skips its HTTP rate limiter. Prove it with a test: the 11th attempt in a minute is refused even with the right password.

## 3. Data that goes stale
- Seeds that build "today" from the moment they ran leave an empty dashboard the next day. Check the live app's "today" screens.
- Fix with a roll-forward: close out yesterday's open records through the normal state rules (so the audit log shows it), add today's demo records if today is empty, run it on every deploy and on a daily cron protected by a secret. Idempotent, and nothing deleted.

## 4. Fan-out and N+1
- Count SQL statements per request (statement logging on a local Postgres, one request at a time). Each page and API route should run a small constant number.
- Count background requests per page in the verify timings. Framework link prefetch on every row (Profile, Edit, Details) renders each record's page on the server; prefetch on hover or focus instead, through one link component.

## 5. Screens
- Designed error, not-found and global-error pages. A bad id and a thrown query must not show the framework default.
- Every list has empty, loading and error states. Skeletons sized like the real content so nothing jumps (CLS 0).
- Phone at 375px: tap targets at least 44px, nothing scrolls sideways, chart labels do not overlap, form errors move focus to the first bad field.
- Final or destructive actions (complete, cancel, delete) behind a confirm that says what will happen.
- Controls respond instantly: optimistic updates, filters that light up on press, polling paused while a save is in flight so it cannot flick the value back.

## 6. Speed
- Lighthouse phone on every main flow, signed in. Target 90 and up. Usual causes: monitoring SDKs on first load (load after idle, only when configured), a layout awaiting the session around the whole page (render the page, suspend only the user menu), formatters built per render, a first-visit tour becoming the LCP.
- Load: seed 100,000 rows, run the same flows, record median, 95th percentile and slowest per route in `docs/load-test.md` with the machine and commit.

## 7. Docs say only what was measured
README claims, cost estimates and "done" tables must match the code and the measurements. Search for "not tested", "to record", "to be filled", stale steps for removed screens, and model names in AI disclosures (the commit trailers are the record). List known issues honestly.

## 8. Deliverables
Check the brief's submission list item by item: live URL, demo login sent privately, repo history, README sections, video, time log, quotes. Say which are the user's to do.

## Report
A table: check, result, fixed in which commit, or why not. Then the user's to-do list, shortest first.
