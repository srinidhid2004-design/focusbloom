# Prompt 14 — Grounding refinement, clean checkout, and recording plan

## Authorization

The human authorized a penultimate Assignment 3.3 checkpoint on
`feature/assignment-3-part-3`: a deterministic custom-Perspective anchor,
visible draft warning, one bounded live Perspective submission, public
clean-checkout verification, a course-recording plan, active documentation, and
feature-branch commits/pushes. The task prohibited a second live request, live
Garden Guide, dependency/schema/API/Figma changes, historical edits, a merge, or
any `main` change.

## Grounding decision

Each generated alternative now requires `scenario_anchor`, a 1–120-character
quotation. After strict schema parsing, backend validation applies Unicode NFKC,
whitespace collapsing, and case folding to both anchor and the original
1–280-character scenario. The normalized anchor must be a literal substring;
paraphrased, fabricated, empty, oversized, unsafe, and unknown-field output is
rejected as a sanitized malformed response. Rejection makes no second model
call, retry, or fallback and saves no artifact or Seed.

The custom Vue result uses text interpolation to show the original scenario,
exact anchor, **AI-generated draft — review before saving.**, and the warning
that structured output may still introduce assumptions. The Alex and neutral
fallback paths remain reviewed/static and do not claim live anchoring.

## Mocked and live observations

Mocked tests passed exact, case-folded, whitespace-collapsed, and NFKC matches;
rejection and persistence boundaries; lifecycle non-retention; static/custom UI
labels; Prompt 13 scenarios; Guide counts; and continuous Focus rounds. Focused
counts were 32 Perspective/grounding, nine Prompt 13 scenarios, and 33 Guide/
instruction tests. The complete backend passed 93; frontend passed 28; dependency
integrity, ESLint, and build checks passed.

Exactly one live UI submission used the authorized fictional presentation-order
scenario. One provider request succeeded in one attempt with no retry/fallback.
Both alternatives used the accepted anchor `changed the presentation order`.
The UI showed the anchor, original scenario, draft warning, reasoning, missing
context, question, and limitation. Nothing was automatically selected or saved;
database integrity was `ok`, with zero foreign-key violations, artifacts, or
Seeds. No Garden Guide call or diagnostic occurred.

The refinement does not eliminate unsupported generation. The accepted live
draft still offered tentative time-constraint and topic-flow possibilities not
established by the quotation, so visible review and explicit Save remain
necessary.

## Clean-checkout result and remaining work

The first fresh public clone stopped because the README referenced an uncreated
virtual environment and omitted setup/install/database/start/health steps. Codex
did not compensate silently. The required README-only commit added those exact
PowerShell instructions. A second fresh clone then passed environment creation,
dependency/lockfile installation, schema initialization, complete checks,
backend/frontend startup, safe no-key health, required UI paths, database
integrity, and console inspection using the README alone.

No local key or ignored artifact was copied. `npm ci` reported 11 moderate audit
findings; no dependency remediation occurred. The validated cleanup command was
blocked before deletion, so the two unique OS-temporary checkout directories are
reported outside committed evidence. The recording plan is
`docs/part-3-3-recording-plan.md`; recording execution, final reporting, merge,
and Canvas submission remain separate work.
