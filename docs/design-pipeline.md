# FocusBloom design and implementation pipeline

## Evolution

Part 3.1 selected BreathBloom Direction A, a focused central water garden for a
paced 4–6 breathing exercise. That report, comparison, and selected-direction
reference remain historical evidence.

> After Part 3.1 submission and a classroom comparison in which multiple projects centered paced breathing, the project was deliberately revised to explore a more distinctive attention-and-perspective interaction. This classroom observation is user-reported design input, not research evidence or proof of effectiveness.

Alternatives considered for the pivot included retaining breathing as the primary
skill, adding attention activities alongside it, and replacing the active skill.
Retaining it did not address the differentiation goal; mixing two primary skills
would increase entry burden and preserve incompatible timing/data rules. The
approved decision replaces the active product with FocusBloom while preserving
the water-garden visual language and historical evidence.

## Active information architecture

`entry` offers one primary **Start a Focus Garden** action with secondary access
to Perspective Studio, History Garden, preferences, and Support. Focus Garden
uses single-task progressive disclosure. Perspective Studio uses its five
application-owned steps and exposes a reviewed fictional demonstration first. A
separate one-field custom route previews and submits only its fictional
scenario. Next-Step Seed is an optional follow-on. History Garden separates
factual cards from the optional Garden Guide. Support remains globally
available.

The exact 17-state model, nine-table schema, 22-operation route surface, and two
Gemini workflows are in `docs/part-3-2-implementation-plan.md`.

## Design behavior contracts

### Entry

- One-tap Focus Garden start; no questionnaire or mood score.
- Setup is skippable. Remembering preferences requires an explanation and
  explicit user choice; saved preferences remain editable/resettable.
- No dense dashboard.

### Focus Garden

- One activity/instruction at a time, no required typing, no scoring.
- Text equivalent for each visual task.
- Visible `Show me`, `Skip this`, `Stop`, and Support.
- Correct choices start a new round and move the correct option; group focus and
  literal status text announce the change. Stop or Skip ends the activity.
- Explicit reversible difficulty. Standard and No-motion modes are equivalent in
  information and controls.
- No rapid flash, surprise movement, competitive timer, or penalty.

### Perspective Studio and Lens

- Sequence: interpretation → support → uncertainty → alternative →
  accept/edit/reject/create.
- The Alex example is a reviewed, pre-written demonstration without personal
  data or a provider request. Its evidence, uncertainty, and alternatives remain
  isolated to that path.
- Custom input uses exactly one optional short fictional-scenario field. It does
  not inherit demonstration cards or details.
- Preview the exact custom scenario sent to Gemini; display an exact returned
  scenario quotation, reasoning, missing context, a neutral reflection question,
  limitation, original-scenario comparison, and AI-draft warning;
  continue without Gemini using non-personalized reviewed copy; preserve local
  work on failure. Save only after explicit Save; provide Delete and Stop.
- Optional Lens uses a fictional observer, never a required real name.

### Next-Step Seed

- Optional, user-authored if–then form with neutral templates.
- Preview exact saved text. Gemini may format, not choose.
- No reminders or notifications.

### History Garden and Guide

- Factual cards and simple filters; neutral completed/stopped/skipped/provider-
  failed labels; no scores, rank, streaks, diagnosis, or improvement claims.
- Suggested factual questions precede the optional text field.
- Guide questions are limited to FocusBloom records and use the validated
  two-request read-only RAG contract. Zero rows are acknowledged; mutations are
  rejected before execution.
- Explain saved-text deletion separately from retained non-sensitive session
  metadata; complete reset requires confirmation.

## Visual system

Direction A's pale mist/water surfaces, navy text, water blue, leaf green, sage,
warm Stop/Support accent, rounded cards, and garden motifs continue. Decorative
imagery remains subordinate to task instructions. No product claim is based on
color, flowers, leaves, water, or animation.

New editable Figma work is in `05 / FocusBloom Part 3.2 Pivot` (`21:594`) in
[FocusBloom — Assignment 3 Design Evolution](https://www.figma.com/design/L09m1XZX6fNEmR2dqrBkcx).
The selected overview is `27:719`. The pivot record lists all 16 required frame
IDs and dimensions. Historical sections were not deleted, flattened, or replaced.

Static references communicate layout and interaction intent only. They do not
prove focus order, keyboard operation, 200% zoom, reflow, live regions,
cancellation, persistence, SQL safety, or provider behavior.

## Accessibility pipeline

1. Use semantic HTML and controls in visual/reading order.
2. Keep only interactive controls in ordinary Tab order; focus a major heading
   with temporary `tabindex="-1"` when context changes.
3. Provide a visible high-contrast focus indicator and minimum 44×44 targets.
4. Pair every icon/shape/motion state with literal text.
5. Support 390-pixel narrow layout and 200% zoom without two-dimensional page
   scrolling or clipped content.
6. Honor system reduced motion and explicit No-motion. No-motion uses no scale,
   ripple, fade, or translation.
7. Announce major status changes without moving focus or narrating decorative
   animation.
8. Verify keyboard and assistive behavior in the runtime; never infer it from
   Figma or a build.

## Data and model pipeline

Activity metadata is stored by default. Perspective text remains in frontend
memory unless explicitly saved. Writes use stable IDs, idempotency keys,
optimistic versions, and transactions. Saved text is deletable; complete reset is
atomic. The backend stores no diagnosis, inferred mood/crisis, location,
authentication, secret, hidden score, prompt, or raw provider error.

Gemini is fixed to `gemini-3.5-flash-lite`, backend only, no retry, no alternate
provider/model. The reviewed Perspective demonstration permits zero calls. A
custom scenario permits one bounded call whose context contains only that
scenario and whose strict output contains one or two alternatives, a required
scenario anchor, reasoning, missing context, one question, and the exact
limitation. NFKC/whitespace/case-folded anchor text must be a literal substring
of the equivalently normalized scenario; rejection causes no additional call.
History RAG
permits a SQL-proposal call and, only for validated nonempty rows, a grounded-
answer call. Application-owned flows work when Gemini is unavailable.

## Verification pipeline

- **Design:** inspect exact frames, screenshots, dimensions, overflow, fonts,
  copy, control size, Support availability, and No-motion intent.
- **Unit/contract:** temporary-database constraints, state transitions,
  idempotency, delete/reset, call counts, malformed output, and safe errors.
- **Adversarial RAG:** parser allow-list, binding, read-only authorizer, execution
  deadline, snapshot consistency, payload limits, mutation rejection, zero-row,
  and row-reference grounding.
- **Browser:** all 17 states, keyboard, focus, narrow/wide reflow, zoom, Standard/
  No-motion parity, no-input/no-typing paths, failure preservation, stale
  responses, and Support independence.

Assignment 3.3 separates the provider-free reviewed demonstration from the
dynamic custom route. Prompt 14 adds deterministic anchor comparison and a
visible warning while retaining review and explicit Save. Contract and UI checks
use a fake provider, stubbed fetch, and disposable temporary databases; the one
separately authorized live check is recorded distinctly from those mocks.
- **Cross-layer:** compare the same stable IDs and factual values across UI, API,
  and read-only SQLite rows.
- **Evidence:** record expected and observed results separately; mocks are not
  live calls and software checks are not clinical validation.

## Current implementation boundary and next step

The version-2 backend and 17-state Vue experience are implemented. The runtime
uses focused components for entry/preferences, Focus Garden, Perspective Studio,
Perspective Lens, Next-Step Seed, History Garden, Garden Guide, and Support; a
single API service owns exact request bodies and safe response normalization; a
request guard cancels superseded work and rejects late results.

Static frames did not specify flexible text height, every transient failure copy,
or the browser-safe trace boundary. Runtime cards grow with content, heading
focus and modal focus restoration are explicit, and the trace never invents SQL,
parameters, or retrieved rows that the approved API intentionally withholds.
Exact 390×844 and 1024×768 running viewports, missing configuration, and key
deterministic flows were inspected with a disposable database. This is not live-
provider or clinical evidence.

The one authorized anchored live evaluation is complete. It confirmed matching
anchors and the visible warning but also retained tentative details not proved
by the quotation. A corrected README also passed a second fresh public checkout
through setup, schema initialization, complete checks, startup, safe health, and
the required no-key UI path. Next, use the recording plan; do not infer complete
grounding, clinical safety, or effectiveness. Manually recheck official Support
sources by the documented review deadline or after a material source change.
