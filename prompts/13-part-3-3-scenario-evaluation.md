# Prompt 13 — Part 3.3 fifteen-scenario evaluation and live variation

## Authorization and limits

The human authorized a fifteen-scenario mocked evaluation, three required
cross-case behavior checks, and exactly four planned live Perspective
submissions on `feature/assignment-3-part-3`. The task prohibited Garden Guide
live calls, more than four live requests, retries/fallbacks, credentials or raw
provider material in evidence, dependency/schema changes, historical edits, a
merge, and any `main` change.

## Evaluation performed

- Added one credential-free fifteen-scenario fixture and focused backend/frontend
  assertions for snapshots, selective deletion, failed-model Support, stale
  response rejection, and the current scenario-only API body.
- Ran deterministic scenarios for Focus rounds/Stop/Skip, Support independence,
  reviewed and custom Perspective paths, explicit artifact/Seed persistence,
  missing/failing/invalid/duplicate/cancelled model outcomes, and one-/two-call
  Garden Guide outcomes.
- Compared relevant temporary-database snapshots across generation, failure,
  duplicate, mutation rejection, no-match, grounded success, explicit save, and
  selective deletion.
- Confirmed sanitized health, configured-key presence without value, fixed
  `gemini-3.5-flash-lite`, ten-second timeout, one SDK attempt, zero automatic
  retries, and no fallback before live evaluation.
- Submitted LIVE A twice and LIVE B/C once. Exactly four submissions produced
  exactly four provider requests. All four succeeded structurally in one attempt;
  Garden Guide calls were zero and automatic artifact/Seed saves were zero.

## Observed live variation

Repeated LIVE A produced different alternatives and wording while retaining the
same ambiguity and missing-context boundary. Neither result leaked Alex/static
copy or asserted a definite intention. Both did introduce tentative details not
present in the input, such as distraction, reviewing materials, or a drafted
reply.

The genuinely surprising finding was that strict-valid LIVE B reasoning used
general assumptions (“often happens” and “common”) that were not in the submitted
scenario. This identifies a semantic-grounding limitation without changing the
observed structural/safety result or claiming clinical significance.

## Verification classification

Focused backend checks passed 65 cases; the complete backend passed 84 with two
known non-failing dependency warnings. `pip check` was clean. Frontend tests
passed 28 cases, ESLint passed with zero warnings, and the production build
transformed 22 modules. Live database integrity was `ok` with zero foreign-key
violations, four succeeded attempt-count-1 Perspective rows, and no artifact,
Seed, or Garden Guide row.

Mocked and live evidence remain separate in
`docs/part-3-3-evaluation.md`. No screen-reader session, non-English scenario,
long-term repeated-use study, clinical/safety/effectiveness evaluation, Figma
change, submitted-report edit, merge, or Canvas action occurred.
