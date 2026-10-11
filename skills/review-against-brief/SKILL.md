---
description: Grade a project against a brief, a scoring rubric or acceptance criteria the way a strict reviewer would, then rank what to fix. Fans out one grader agent per scoring category, verifies their claims, runs the real checks, scores each category out of 5 and lists fixes by score impact plus how the repo will read to the reviewer. Use when the user pastes a brief or test requirements and says "review this", "how would this score", "what's left", or before a submission.
argument-hint: "[brief text or path]"
---

# Review against the brief

## 1. Ground truth
- Get the brief. If it was pasted, save the scoring parts to `docs/brief.md` only if the user wants them in the repo.
- Pull the latest default branch first and say which commit you reviewed.
- Run the project's own checks: lint, typecheck, unit, integration (start a local database if needed), e2e, and verify flows if they exist. Record pass and fail counts.
- Hit the live URL: sign-in page loads, protected routes redirect, health endpoint answers. Search the live page source for secrets.

## 2. Fan out
Launch one `paved-path:grader` agent per scoring category (for example Tech, UI, Smoothness, User friendliness, Infrastructure), in parallel, read-only. Give each the brief, the category's criteria and the files that matter. Ask for strengths, bugs with a concrete failure scenario, risks and nits, with file and line.

## 3. Verify before repeating
Agents overstate. Before anything goes in the report:
- Re-check every bug they call critical in the code yourself.
- Check claims about history with git (a shallow clone makes history look rewritten when it was not).
- Drop findings you could not confirm, or mark them unverified.

## 4. Report
- **Verdict** in two sentences.
- **Scores** out of 5 per category, one line of why each.
- **Fix before the deadline**, ranked by score impact: what, where, the failure a reviewer would see.
- **Worth fixing if time allows.**
- **How the repo will read to the reviewer**: history, authorship, AI disclosure, leftover agent scaffolding, lines in docs that undercut the author. Name which are decisions for the user, not code.
- Offer to fix the top items on the working branch.

On a re-review, diff against the commit you reviewed last time, mark each earlier finding fixed or still open with evidence, and re-run the checks.
