# Assignment 3.3 dynamic Perspective refinement

## Purpose and decision

Assignment 3.3 separates two Perspective Studio experiences that previously
shared state:

1. **Reviewed fictional demonstration:** the pre-written Alex example, its
   reviewed evidence/uncertainty cards, and reviewed alternatives remain a
   no-input, no-provider demonstration.
2. **Custom fictional scenario:** one optional 280-character scenario is
   normalized by trimming outer whitespace, previewed exactly, and sent in one
   bounded Gemini request only after an explicit Generate action.

The original design emphasized a reviewed fictional example to minimize input
burden and provider risk. Implementation review showed that the custom route
still reused evidence and uncertainty written for that example. Part 3.3
separates the reviewed demonstration from a genuinely dynamic custom route,
while retaining one-field input, strict model boundaries, explicit saving, and
a deterministic failure path.

This refinement does not add a questionnaire, mood/emotion label, diagnosis,
chatbot, reminder, score, or provider-controlled navigation/save action. It does
not change the version-2 database schema, 22-operation API count, fixed model,
dependencies, or historical Figma evidence.

## Custom request boundary

The frontend sends this strict backend request:

```json
{
  "idempotency_key": "UUID generated for this explicit action",
  "scenario": "one normalized fictional scenario, 1–280 characters"
}
```

The provider receives only this bounded context:

```json
{"scenario":"the same normalized fictional scenario"}
```

Unknown request fields are rejected. The Alex interpretation, evidence,
uncertainty, Lens label, and reviewed alternatives are neither displayed in the
custom review state nor included in the request. The service stores only a
request hash and lifecycle metadata; it does not store raw input or provider
output in `model_requests`.

## Custom response boundary

Gemini must return strict structured JSON with one or two alternatives:

```json
{
  "alternatives": [
    {
      "alternative": "1–240 characters",
      "reasoning": "1–240 characters, based only on the scenario",
      "missing_context": "1–240 characters"
    }
  ],
  "reflection_question": "1–180 characters",
  "limitation": "Coursework prototype; not therapy or medical advice."
}
```

Pydantic forbids unknown fields at every level and enforces the collection,
length, and exact-limitation constraints. Application validation rejects links,
markup, advice/action selection, clinical/crisis/emotion claims, effectiveness
claims, definitive-intent phrases, and known Alex-demonstration details that
were not submitted. Invalid output is discarded behind a sanitized error.

The adapter remains fixed to `gemini-3.5-flash-lite`, a ten-second timeout, one
SDK attempt, zero automatic retries, strict JSON, and no provider/model
fallback. Missing configuration and structurally invalid input cause zero
provider requests. A successful or failed accepted request causes one attempt;
an already-recorded idempotency key causes no additional attempt.

## Frontend behavior

- The reviewed demonstration is explicitly labeled and uses zero provider
  requests. Its static source label is **Reviewed fictional example**.
- Custom mode contains one scenario field and one primary Generate action. Its
  preview shows the exact scenario sent to Gemini.
- Valid output exposes alternative, reasoning, missing/uncertain context,
  reflection question, exact limitation, and **Gemini-generated draft** source
  text through semantic HTML without `v-html`.
- A failure preserves the normalized scenario in browser memory. Continue
  without Gemini shows general reviewed copy that explicitly says it is not a
  scenario-specific analysis.
- Skip/Continue without Gemini, Stop and go back, retry by explicit choice,
  stale-response rejection, Delete, global Support, and explicit artifact Save
  remain available. Generation never saves an artifact.
- Perspective Lens remains optional and never requires a real name. A custom
  path uses a generic fictional-observer label rather than inserting Alex.
- Next-Step Seed remains optional and user-authored. Preview is required before
  its separate explicit Save; no generated alternative becomes a plan
  automatically.

## Focus Garden refinement

A correct choice now starts a new round rather than completing the activity.
The correct option moves one position each round, the moved group receives
programmatic focus with a new-round label, and position-neutral hints remain
accurate. The activity stays active until the user selects Stop or Skip; Support
still records an interruption. No score, streak, countdown, penalty, or failure
label was added.

## Verification and evidence boundary

Credential-free backend tests use fake keys, an injected fake gateway, and
temporary databases. Frontend tests use stubbed fetch responses. They verify
request isolation and normalization, 0/1 request counts, idempotency, strict
unsafe/malformed output rejection, dynamic display differences, failure
preservation, no automatic artifact/Seed save, explicit Seed preview/Save, and
the looping/moving Focus Garden behavior.

These checks are mocked contract and application evidence. A later separately
authorized evaluation must use a fictional custom scenario to assess whether a
live `gemini-3.5-flash-lite` response is relevant and sufficiently tailored.
That future check must not be described as clinical, safety, or effectiveness
validation.

## Preserved boundaries

- No runtime database access or migration.
- No credential read and no live provider request.
- No dependency, Figma, voice/audio, schema, or route-count change.
- No automatic save of custom input, provider output, alternative, or Seed.
- No change to `main`, the Part 3.1 report/decisions/prompts, the submitted
  Assignment 3.2 report, prompts 01–11, or prior evidence images.
