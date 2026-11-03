# Assignment 3.3 Perspective grounding refinement

## Purpose and evidence boundary

Prompt 13 found that a live response could satisfy the strict JSON schema while
using general presentation claims not supplied by the fictional scenario. Shape
validation was working, but shape alone did not establish semantic grounding.

This refinement adds one deterministic input quotation and a visible review
warning. It reduces one class of unsupported output; it cannot prove that every
generated claim follows from the quotation, eliminate hallucination, or
establish clinical safety, effectiveness, or suitability for distress.

## Scenario-anchor contract

Every Gemini-generated custom alternative now requires exactly four fields:

```json
{
  "alternative": "One tentative possibility",
  "scenario_anchor": "exact short text from the submitted scenario",
  "reasoning": "Why this remains one possibility",
  "missing_context": "What the scenario does not establish"
}
```

`scenario_anchor` is required, contains 1–120 characters, and remains subject to
the existing strict unknown-field and safe-text rules. The original scenario
remains 1–280 characters. After schema validation, the backend normalizes the
anchor and scenario with this deterministic sequence:

1. Unicode NFKC normalization;
2. collapse every run of Unicode whitespace to one ASCII space; and
3. Unicode case folding.

The normalized anchor must be a literal substring of the normalized submitted
scenario. Case and harmless whitespace/compatibility differences may match; a
paraphrase, fabricated phrase, empty value, or value longer than 120 characters
does not. Any mismatch becomes the same sanitized `malformed_response` outcome.

The check occurs after strict provider-output parsing and inside the existing
one-request path. Rejection makes no second grounding call, retry, or fallback.
The model instruction names the exact four keys, includes a matching-anchor
example, and tells Gemini not to introduce scenario-specific events as
established facts.

## Application and persistence boundaries

- Gemini stays fixed to `gemini-3.5-flash-lite`, with a ten-second timeout, one
  SDK attempt, zero automatic retries, and no provider/model fallback.
- The provider still receives only the submitted fictional scenario.
- `model_requests` still stores an input hash and factual lifecycle metadata,
  not scenario text, anchor text, or provider output.
- Generation still creates no Perspective artifact or Next-Step Seed.
- Selecting, editing, rejecting, explicitly saving, and deleting remain
  application/user actions.
- The reviewed Alex demonstration and Continue-without-Gemini material remain
  static reviewed content. Neither claims a live scenario anchor.
- Garden Guide, Focus Garden, schema version, route count, and dependencies are
  unchanged.

## Visible review boundary

For accepted custom Gemini output, Vue text interpolation displays:

- **AI-generated draft — review before saving.**
- **Based on text from your scenario:** followed by the exact returned anchor;
- the alternative, reasoning, and missing context;
- the reflection question and coursework limitation;
- the original fictional scenario; and
- **Structured output may still introduce assumptions. Compare every draft
  with your original scenario.**

No `v-html` is used. No alternative is selected or saved automatically. Edit,
Reject, Create my own, explicit Save/Delete, Stop/Back, and Support remain
available.

## Mocked verification

Fake credentials, an injected gateway, stubbed browser fetch, and disposable
SQLite databases verified:

- exact, case-insensitive, repeated-whitespace, and NFKC-normalized matches;
- absent and paraphrased anchor rejection;
- empty, oversized, unknown-field, unsafe, and malformed rejection;
- one accepted request or one rejected request with no retry/fallback;
- no artifact or Seed after generation/rejection;
- no scenario/anchor column or text in lifecycle storage;
- exact anchor, original scenario, draft label, and warning in the custom UI;
- no live-anchor claim in the Alex or static fallback paths;
- explicit Save remains required;
- all Prompt 13 scenarios, Guide counts, and continuous Focus rounds remain
  green.

Observed results before the live check were 32 focused Perspective tests, nine
Prompt 13 scenario tests, 33 Guide/instruction tests, 93 complete backend tests,
and 28 frontend tests. `pip check`, ESLint with zero warnings, and the production
build also passed. The two known dependency deprecation warnings remained
non-failing.

## Single bounded live check

Safe preflight reported service `ok`, schema version 2, temporary database
available, and key status `configured` without exposing a value. The environment
file remained ignored/untracked. The fixed model, one attempt, zero retry, and no
fallback were rechecked before submission.

Exactly one application submission used this fictional input:

> A fictional teammate changed the presentation order without explaining why.

It produced exactly one provider request and one succeeded attempt-count-1
lifecycle row. No diagnostic, retry, Garden Guide request, artifact, or Seed was
created. Both returned alternatives used the accepted anchor `changed the
presentation order`, which appears in the submitted scenario under the
deterministic comparison.

Validated public application output:

1. **Anchor:** changed the presentation order
   - **Alternative:** The change might have been made to fit time constraints.
   - **Reasoning:** The text notes the order was altered without explanation,
     which could potentially relate to scheduling or time limits.
   - **Missing context:** We do not know the actual timeline or schedule
     constraints the teammate was working with.
2. **Anchor:** changed the presentation order
   - **Alternative:** The adjustment could have been an attempt to improve the
     flow of topics.
   - **Reasoning:** Since the order was modified, it is possible the arrangement
     was revised for structural reasons.
   - **Missing context:** We do not know the intended structure or goals for the
     presentation sequence.

**Reflection question:** What factors might lead to a change in presentation
order without an immediate explanation?

**Limitation:** Coursework prototype; not therapy or medical advice.

The running UI displayed the original scenario, both anchors, draft label,
assumption warning, reasoning, missing context, reflection question, and
limitation. Save remained disabled until selection. Browser warning/error logs
were empty. The disposable database reported `integrity_check=ok`, zero
foreign-key violations, one model lifecycle row, zero artifacts, and zero Seeds.

The alternatives still introduced tentative time-constraint and flow
possibilities not established by the anchor. This is the intended remaining
limitation: a matching quotation improves reviewability but does not prove that
every generated statement is supported.

## Public clean-checkout verification

The first unique public clone correctly contained no environment file, runtime
database, virtual environment, `node_modules`, cache, or build output. Following
the then-current README stopped at its first check because
`backend/.venv/Scripts/python.exe` did not exist. The README also omitted
dependency installation, lockfile installation, database initialization,
startup, and health commands. No undocumented command was used to compensate.

A separate README-only commit added this exact setup sequence:

```powershell
git clone https://github.com/srinidhid2004-design/focusbloom.git
Set-Location focusbloom
git checkout feature/assignment-3-part-3
py -3.14 -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt pytest==9.1.1 httpx==0.28.1
Push-Location frontend
npm ci
Pop-Location
```

The second unique public clone followed those commands, then the documented
database command:

```powershell
New-Item -ItemType Directory -Force -Path data | Out-Null
$env:DATABASE_PATH = Join-Path (Resolve-Path data).Path 'app.sqlite3'
Push-Location backend
.venv/Scripts/python.exe -c "from app.config import Settings; from app.database import Repository; settings = Settings(_env_file=None); Repository(settings.database_path).initialize(); print('FocusBloom schema version 2 initialized.')"
Pop-Location
```

It then followed the documented `pip check`, complete backend pytest, `npm test`,
ESLint, and build commands; all passed with the same results as the working
checkout. The documented Uvicorn and Vite commands started successfully. Safe
health returned service `ok`, schema version `2`, database `available`, and key
`not configured`.

The no-key running walkthrough observed a new Focus round and moved target,
Support interruption without resume, reviewed provider-free Alex alternatives,
preserved custom text through missing configuration, and Support after that
failure. The missing-configuration request created one zero-attempt lifecycle
row and no provider call, artifact, or Seed. Browser warning/error logs were
empty; database integrity was `ok` with zero foreign-key violations. Both
services were stopped through their own sessions.

The clean clone remained tracked-clean. Only the README-documented virtual
environment, dependency folder, caches, build output, and database appeared as
ignored local state. `npm ci` also reported 11 moderate audit findings; no audit
fix or dependency change was attempted because it was outside this checkpoint.

The validated recursive cleanup command was blocked by the execution policy
before deletion. Both uniquely named checkout directories therefore remain
under the operating-system temporary directory; their private absolute paths
are intentionally not committed and are reported only in the task response.
