# AI use record

## Boundary

AI tools assisted with research synthesis, architecture planning, editable Figma
construction, safe scaffold branding, tests, and documentation. Human-approved
decisions define the active FocusBloom scope. AI output is not evidence of
clinical safety, effectiveness, user benefit, or crisis detection. Only fictional
examples and credential-free mocks are permitted.

## Tools and roles

- **OpenAI Codex:** inspected the repository, maintained project records, applied
  basic branding, designed and refined the state/data/API/model contracts, ran
  local checks, and managed authorized feature-branch publication. It did not
  make clinical decisions.
- **Figma integration:** inspected the existing editable design, reused the water-
  garden variables/styles, created the new FocusBloom section and editable frames,
  and ran programmatic structural checks. Browser control was used only for the
  file-level rename that the integration did not expose.
- **Internet research/search:** opened the eight named primary research sources
  and recorded limited findings. Studies were not treated as proof of FocusBloom
  outcomes.
- **Google Gemini (`gemini-3.5-flash-lite`):** is the fixed backend adapter model
  for two bounded purposes. Version-2 tests used an injected fake gateway only;
  no live request or real credential was used.
- **Git/GitHub:** verified branch/history state, retained the existing repository,
  and published only the authorized feature-branch pivot. No second repository,
  history rewrite, force push, or `main` change is permitted.

No voice, audio, microphone, speech, biometric, geolocation, participant, or
private third-party tool/data was used.

## Human-approved product decisions

- Rename the active product to FocusBloom and preserve historical BreathBloom
  evidence.
- Make Focus Garden the primary no-typing experience.
- Use Perspective Studio's five-step one-minute cognitive reframe as the formal
  course skill, with fictional-example and optional fictional-observer paths.
- Keep Next-Step Seed optional and user authored.
- Keep History Garden factual and unscored.
- Bound Gemini to perspective alternatives and read-only factual history RAG.
- Keep Support static and independent.
- Retain the local folder name for tool/project continuity while renaming the
  public repository.

## Figma construction and validation

The integration reused existing editable visual foundations and created section
`05 / FocusBloom Part 3.2 Pivot`, 16 required product frames, three reusable
components, and a selected overview. It checked dimensions, overflow, fonts,
placeholder copy, control sizes, primary-action count, and Support availability.
A screenshot review found an overview design note overlapping the legend; the
note positions were revised and the screenshot was reviewed again.

One early scripted construction approach tried to reuse component-property keys
and ellipse-node construction assumptions that were not valid for the available
Figma Plugin API context. The approach was revised to set supported node
properties directly and create fresh editable shape nodes. The rejected approach
was not kept in the design. This is a tooling correction, not a design outcome.

Static Figma validation does not prove keyboard behavior, reflow, persistence,
provider behavior, or runtime accessibility.

## Research assistance and limits

AI summarized visual-search, digital-nature, reappraisal/distancing,
third-person self-talk, implementation-intention, and affect-labeling research.
The active pivot record links the primary sources and states their limitations.
The research supports questions and design rationale, not claims that FocusBloom
calms, treats, restores attention, or improves a user.

## Runtime model contract (implemented and mocked)

The reviewed Alex Perspective demonstration uses zero provider requests. A
custom Perspective scenario uses at most one request whose provider context is
only the normalized fictional scenario. Its strict bounded JSON contains one or
two alternatives, a required exact scenario quotation, reasoning and missing
context for each, one reflection question, and the exact coursework limitation.
Unknown fields, unsafe text, and known unsubmitted Alex-demonstration details are
rejected. The backend applies NFKC, whitespace collapse, and case folding and
requires the normalized anchor to be a literal substring of the normalized
scenario. There is no advice,
automatic save, retry, or provider/model fallback. History RAG uses
at most two requests: one SQL proposal followed by one grounded answer only when
validated rows exist. The backend validates a deliberately small SELECT grammar,
uses a read-only URI, default-deny authorizer, bound execution/payloads, snapshot
check, and row-reference validation, and rejects mutations before execution.
Application-owned fixed status messages handle missing configuration or failure
without fabricating model content.

The first complete version-2 test cycle passed, but review found two boundaries
that were correctable before publication: reused idempotency keys needed to
conflict when content differed, and the SQL WHERE grammar was initially broader
than necessary. The implementation was revised to compare stored input hashes/
content and to accept only allow-listed bound comparison predicates. The full
suite passed again. This is mocked adapter evidence, not a live-provider result.

## Evidence integrity

Prompt records distinguish requested work from observed results. The submitted
Part 3.1 report and prompts 01–06 are unchanged. Tests, Figma checks, Git checks,
and repository-redirect checks are recorded only after observation. A mock is
never described as a live call. Version-2 backend behavior is described as
implemented only where temporary-database and fake-gateway tests observed it;
frontend behavior is implemented and locally verified. Separately authorized
Prompt 10 checks distinguish tiny diagnostics from the successful bounded live
Perspective and Garden Guide flows; failed attempts remain failed evidence and
are not relabeled as success.

## Prompt 09 frontend implementation

Codex used the mandatory Figma design-to-code workflow for read-only inspection
of the approved overview and representative narrow/wide frames, then translated
the static React/Tailwind-like context into the repository's Vue 3 Composition
API and plain CSS. No Figma content was modified and no temporary Figma asset URL
was used at runtime.

Codex created focused Vue components, a normalized API service, a stale-request
guard, deterministic visual-activity data, and contract/UI tests. Automated
browser control exercised the running app only against a disposable temporary
database and missing-key configuration. The browser produced no warning/error
logs. No live Gemini request or real credential was used.

The first implementation pass passed the build but exposed existing ESLint
formatting expectations and two test setup assumptions; formatting and test
fixtures were corrected. A later live browser pass exposed an active Perspective
session when the user left after continuing without Gemini. The lifecycle was
revised to persist stopped or completed status before navigation, and the full
frontend checks passed again. These were tooling/runtime corrections, not claims
of clinical benefit.

## Prompt 10 bounded live verification

Codex used the running local interface, read-only database inspection, and a
fixed fictional example to verify the integrated flow. Two full Perspective
attempts first failed safely. One exact diagnostic isolated an unsupported
provider-schema keyword; the adapter translated only that single-value `const`
to the equivalent supported `enum[value]`, while Pydantic validation remained
unchanged. The corrected Perspective request succeeded once and saved nothing
automatically.

The first Garden query proposal was safely rejected. One bounded diagnostic then
showed that the generation instruction and existing validator grammar were
misaligned. Only the instruction changed. A fresh UI submission used exactly two
requests, retrieved two bounded read-only rows, and returned a validated answer
with references 1 and 2. No retry or fallback occurred. The human explicitly
selected the artifact deletion that left the Seed intact. Provider requests,
mocked tests, application actions, and diagnostics are counted separately in the
verification and evidence records.

## Prompt 11 final report and publication

Codex drafted the Canvas-ready Assignment 3.2 report, curated public-safe links,
manually reviewed all seven official Support destinations in a normal browser,
and ran the full backend/frontend and repository audits. The manual source review
did not start a chat, call, text, treatment search, or location/personal-data
submission. Final regression used only disposable temporary databases and made
no Gemini request. The human authorized the publication and merge workflow;
Canvas submission remains manual.

## Prompt 12 dynamic Perspective refinement

Codex preserved the three authorized local Focus Garden edits while creating
`feature/assignment-3-part-3` from the verified main SHA. It separated the
pre-written Alex demonstration from the dynamic custom route, reduced the
custom provider context to one normalized fictional `scenario`, expanded the
strict output contract to reasoning, missing context, and a reflection question,
and kept the existing explicit-save and request-lifecycle boundaries.

The Focus Garden refinement continues after correct choices, moves the correct
option between rounds, focuses the refreshed group, uses position-neutral hints,
and ends only through Stop, Skip, or the existing Support interruption. Tests
used fake keys, mocked gateway output, stubbed fetch, and temporary databases.
No environment file, project runtime database, Figma artifact, or live Gemini
request was accessed during Prompt 12. At that checkpoint, a later separately
authorized live-model check remained necessary; Prompt 13 performed that bounded
evaluation as recorded below.

## Prompt 13 scenario evaluation and live variation

Codex added a versioned 15-scenario fictional fixture and deterministic backend
and frontend tests for continuing/terminal Focus Garden behavior, Support after
model failures, reviewed and dynamic Perspective paths, explicit artifact and
Seed persistence, safe failures, duplicate/cancelled/stale responses, and the
one- or two-call read-only Garden Guide boundary. Mocked and live observations
are kept separate in `docs/part-3-3-evaluation.md`.

After a safe configuration preflight, Codex made exactly four authorized live
Perspective submissions: scenario A twice, then scenarios B and C once each.
Each used one provider request, succeeded without a retry or fallback, satisfied
the strict bounded schema, and created no artifact or Seed. No live Garden Guide
request was made. The two A responses differed in wording while preserving the
same uncertainty boundary. The evaluation also recorded that valid structure is
not proof of perfect grounding: one response relied on general claims not stated
in the fictional input. No raw provider payload, credential, personal data, or
private path was added to repository evidence.

This is coursework response-quality and control-flow evidence only. It does not
establish therapy, diagnosis, crisis handling, clinical safety, attention,
emotion, improvement, or effectiveness. Real screen-reader use, non-English
scenarios, and long-term repeated use remain untested.

## Prompt 14 grounding refinement

Codex converted the Prompt 13 semantic-grounding finding into one deterministic
control: every custom alternative requires a short `scenario_anchor` that must
match the submitted scenario after NFKC normalization, whitespace collapsing,
and case folding. Strict validation still rejects unknown/unsafe output, and an
anchor mismatch ends the existing single attempt without another grounding
call, retry, fallback, artifact, or Seed.

Vue now displays the original scenario, exact anchor, **AI-generated draft —
review before saving.**, and a warning to compare every draft with the original.
It uses ordinary text interpolation. Static Alex and Continue-without-Gemini
content remain reviewed and do not claim live anchoring.

After the mocked regression passed, Codex made exactly one authorized live UI
submission with the fictional presentation-order input. One request succeeded
in one attempt; both alternatives returned the matching anchor `changed the
presentation order`. No content was selected or saved automatically, browser
warning/error logs were empty, and the disposable database had clean integrity,
one lifecycle row, zero artifacts, and zero Seeds. The response still introduced
tentative possibilities not proved by the anchor, confirming that quotation
matching improves reviewability but does not establish complete grounding.

The first public clean checkout then exposed incomplete README setup
instructions; Codex did not silently compensate. A separate README-only commit
added the exact Windows environment, pinned test dependency, lockfile install,
database initialization, startup, and health sequence. A second fresh public
clone followed it successfully with no key: complete checks passed, the static
and no-key runtime paths behaved as documented, and browser warning/error logs
were empty. No ignored local artifact was copied. `npm ci` reported 11 moderate
audit findings; no audit fix or dependency change was made in this checkpoint.
