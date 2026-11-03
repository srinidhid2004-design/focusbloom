# Assignment 3.3 fifteen-scenario evaluation

## Evidence boundary

This checkpoint evaluates a fictional coursework prototype. Mocked results use
fake credentials, an injected fake gateway, stubbed browser fetch, and temporary
SQLite databases. The live section records only strict, validated application
output from four deliberately authorized Perspective submissions. It does not
contain a credential, environment content, request header, raw provider payload,
raw provider error, private path, or real-person data.

The evaluation does not establish therapy, diagnosis, crisis detection,
clinical safety, attention/emotion change, improvement, effectiveness, or
suitability for someone in distress.

## Start and configuration gate

- Active branch and upstream began at
  `8c463b99f5af2c9bb002dc939be5de3dd25bd2b8`.
- Local and remote `main` remained
  `769bfcd8581efc8faab9ab64d953fa995c3595f8`.
- The working tree and index were clean before evaluation.
- `backend/.env`, `data/app.sqlite3`, dependency directories, caches, and build
  output were ignored and untracked; no credential or runtime file was tracked.
- Sanitized live health reported service `ok`, schema version 2, temporary
  database `available`, and key `configured` without a value.
- The model remained `gemini-3.5-flash-lite`, with a 10-second timeout, one SDK
  attempt, zero automatic retries, and no provider/model fallback.
- The live evaluation used an ignored disposable cache database. It did not open
  or change `data/app.sqlite3` and did not call Garden Guide.

## Mocked fifteen-scenario matrix

The credential-free source record is
`backend/tests/fixtures/part_3_3_scenarios.json`. The observations below combine
the clearly named Prompt 13 tests with existing focused contract/UI tests.

### SCN-01 — Focus Garden continuing rounds

- **Category:** deterministic Focus Garden activity state.
- **Fictional action/input:** choose the pointed leaf correctly in two
  consecutive rounds.
- **Expected:** activity remains active and the target moves.
- **Classification:** mock/stubbed frontend.
- **Provider calls expected/observed:** 0 / 0.
- **Persistence expected:** attempt events only; no terminal update.
- **Persistence observed:** no PATCH and no `completed` event before Stop; correct
  index moved 1 → 2 → 0 and the refreshed group received focus.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, “keeps the activity active…”
- **Note/limitation:** DOM focus is tested in jsdom, not a real screen reader.

### SCN-02 — Explicit Stop

- **Category:** user-controlled activity termination.
- **Fictional action/input:** select Stop after a correct round.
- **Expected:** exactly one stopped outcome occurs only after the selection.
- **Classification:** mock/stubbed frontend.
- **Provider calls expected/observed:** 0 / 0.
- **Persistence expected:** one `stop` PATCH and no completed event.
- **Persistence observed:** no earlier PATCH; one `stop` PATCH after selection;
  no `completed` event.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, continuing-round test.
- **Note/limitation:** elapsed duration is stubbed and is not a timing study.

### SCN-03 — Skip without failure language

- **Category:** optional activity exit and neutral copy.
- **Fictional action/input:** select **Skip this** during an active activity.
- **Expected:** skipped outcome without score, penalty, or failure label.
- **Classification:** mock/stubbed frontend.
- **Provider calls expected/observed:** 0 / 0.
- **Persistence expected:** one `skip` terminal update and no completion.
- **Persistence observed:** `skip` PATCH and `skipped` event; visible copy said
  “skipped without a score or penalty”; no completed event.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, Skip test.
- **Note/limitation:** this checks literal UI/state behavior, not user impact.

### SCN-04 — Support independence across states

- **Category:** Support independence and focus restoration.
- **Fictional action/input:** open/close Support during an active activity and
  after missing configuration, timeout, malformed output, and another provider
  failure.
- **Expected:** no provider request from Support, no hidden resume/restart/save,
  state retained, and focus restored to the Support trigger.
- **Classification:** mock/stubbed frontend.
- **Provider calls expected/observed:** 0 additional / 0 additional.
- **Persistence expected:** only the explicit activity interruption may persist.
- **Persistence observed:** activity became `interrupted`; returning did not
  resume it. Failed custom text stayed visible, provider submission count did
  not change, no artifact POST occurred, and focus returned to Support.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, No-motion/Support test and four
  parameterized failed-model Support cases.
- **Note/limitation:** provider categories share the same sanitized failed-model
  UI, by design.

### SCN-05 — Reviewed Alex demonstration

- **Category:** provider-free reviewed Perspective content.
- **Fictional action/input:** open the pre-written demonstration and view its
  reviewed alternatives.
- **Expected:** static reviewed output and zero Gemini requests.
- **Classification:** mock/static frontend.
- **Provider calls expected/observed:** 0 / 0.
- **Persistence expected:** no automatic artifact save.
- **Persistence observed:** no `/perspective/alternatives` request and no
  artifact POST; source label was **Reviewed fictional example**.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, reviewed-demonstration test.
- **Note/limitation:** this demonstrates reviewed copy, not model variation.

### SCN-06 — Custom fictional scenario A

- **Category:** mocked dynamic Perspective success.
- **Fictional action/input:** submit the fictional changed-study-room scenario
  after outer-whitespace normalization.
- **Expected:** tailored fixed output, exact scenario-only request, no Alex text.
- **Classification:** mock/stubbed frontend and fake backend.
- **Provider calls expected/observed:** 1 / 1.
- **Persistence expected:** one lifecycle request, no artifact.
- **Persistence observed:** request contained only `idempotency_key` and
  `scenario`; complete output fields appeared; no artifact POST occurred.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, normalized-custom test;
  `backend/tests/test_perspective.py`.
- **Note/limitation:** output relevance is deterministic fixture behavior.

### SCN-07 — Different custom scenario B

- **Category:** mocked Perspective input/output variation.
- **Fictional action/input:** submit the fictional open-window and moved-lamp
  scenarios separately.
- **Expected:** distinct fixed output for each input.
- **Classification:** mock/stubbed frontend.
- **Provider calls expected/observed:** 1 per submission / 1 per submission.
- **Persistence expected:** no artifact for generation alone.
- **Persistence observed:** window output did not contain the lamp result and
  lamp output did not contain the window result; neither run saved.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, two-draft variation test.
- **Note/limitation:** deterministic variation does not predict live variation.

### SCN-08 — Explicit artifact save and selective deletion

- **Category:** explicit artifact persistence and deletion.
- **Fictional action/input:** generate, explicitly save two reviewed artifacts,
  and delete one selected artifact.
- **Expected:** generation saves nothing; deletion removes only the target.
- **Classification:** mock backend with temporary SQLite plus stubbed frontend.
- **Provider calls expected/observed:** 1 / 1.
- **Persistence expected:** domain tables unchanged after generation; after two
  saves and one deletion exactly the other artifact remains.
- **Persistence observed:** domain snapshot matched after generation; two
  explicit POSTs created two artifacts; target DELETE left the second intact.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_part_3_3_scenarios.py`; frontend explicit
  artifact Save/Delete test.
- **Note/limitation:** no concurrent deletion race was evaluated.

### SCN-09 — User-authored Next-Step Seed

- **Category:** explicit user-authored Seed persistence.
- **Fictional action/input:** enter a fictional if–then plan, preview, save, and
  delete it separately.
- **Expected:** no pre-preview write; explicit Save; Seed-only deletion.
- **Classification:** mock backend and stubbed frontend.
- **Provider calls expected/observed:** 0 / 0.
- **Persistence expected:** one explicit Seed, then no Seed after target deletion;
  artifacts unaffected.
- **Persistence observed:** no POST before Preview/Save; saved body contained the
  user's exact situation/action; Seed DELETE did not issue artifact DELETE; the
  backend selective-deletion snapshot left the remaining artifact intact.
- **Result:** Pass.
- **Evidence:** `frontend/src/App.test.js`, Seed test;
  `backend/tests/test_part_3_3_scenarios.py`.
- **Note/limitation:** no reminder or scheduling behavior exists or was tested.

### SCN-10 — Missing Gemini configuration

- **Category:** safe missing-configuration failure.
- **Fictional action/input:** submit a custom scenario with the backend key
  absent.
- **Expected:** zero provider attempts, preserved input, no saved text.
- **Classification:** mock backend and stubbed frontend.
- **Provider calls expected/observed:** 0 / 0.
- **Persistence expected:** zero-attempt failed lifecycle row only.
- **Persistence observed:** fake gateway remained uncalled; safe
  `missing_configuration` state retained the custom scenario and no artifact
  POST occurred.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_perspective.py`; frontend failure and Support
  cases.
- **Note/limitation:** the frontend still makes one local API submission; the
  provider count is zero.

### SCN-11 — Timeout/provider failure

- **Category:** bounded provider failure and zero retry.
- **Fictional action/input:** return timeout, malformed-response, or general
  failure from the fake gateway.
- **Expected:** one attempt, zero retry, preserved UI input, no saved text.
- **Classification:** mock backend and stubbed frontend.
- **Provider calls expected/observed:** 1 / 1.
- **Persistence expected:** only one failed lifecycle row.
- **Persistence observed:** domain, conversation, and message snapshots matched;
  exactly one attempt-count-1 model row was added; Support retained UI state.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_part_3_3_scenarios.py`; frontend failed-state
  Support cases.
- **Note/limitation:** raw provider details are intentionally unavailable.

### SCN-12 — Malformed/unsafe/oversized/unknown output

- **Category:** strict output rejection.
- **Fictional action/input:** fake output includes an extra field, 241-character
  reasoning, definitive intent, unsubmitted Alex content, unsafe advice, too
  many alternatives, or a missing required field.
- **Expected:** reject output, one attempt, no automatic save.
- **Classification:** mock backend.
- **Provider calls expected/observed:** 1 / 1 for every accepted request.
- **Persistence expected:** failed lifecycle only; saved-text tables unchanged.
- **Persistence observed:** every body returned sanitized model failure; the
  failure snapshot test found domain tables unchanged and no artifact/Seed.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_perspective.py` bad-result matrix and
  `backend/tests/test_part_3_3_scenarios.py`.
- **Note/limitation:** structural filters cannot prove all semantic grounding.

### SCN-13 — Duplicate, cancellation, and stale result

- **Category:** asynchronous/idempotency safeguards.
- **Fictional action/input:** repeat an idempotency key; cancel a pending custom
  request and resolve its stubbed response later.
- **Expected:** duplicate adds zero provider calls/persistence; late output cannot
  overwrite current state or save.
- **Classification:** mock backend and stubbed frontend.
- **Provider calls expected/observed:** duplicate 0 additional / 0 additional;
  cancelled UI 1 initial local submission / 0 follow-up submissions.
- **Persistence expected:** byte-for-byte stable duplicate snapshot and no stale
  artifact write.
- **Persistence observed:** full database snapshot matched before/after duplicate;
  fake provider remained at one total call. Late text never appeared; reviewed
  fallback remained and no artifact POST occurred.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_part_3_3_scenarios.py`; frontend late-response
  test.
- **Note/limitation:** network cancellation timing is simulated, not load-tested.

### SCN-14 — Garden Guide rejection and no-match

- **Category:** bounded one-call retrieval rejection/no-match.
- **Fictional action/input:** return a mutation proposal or a validated query
  with zero matching rows.
- **Expected:** exactly one provider request, no answer generation, protected
  domain data unchanged.
- **Classification:** mock backend with temporary SQLite.
- **Provider calls expected/observed:** 1 / 1.
- **Persistence expected:** request lifecycle may change; no assistant answer or
  domain mutation.
- **Persistence observed:** only `history_sql` ran; domain snapshot and the
  preexisting user-message snapshot matched. Mutation was rejected before
  execution; no-match returned fixed copy.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_part_3_3_scenarios.py` and
  `backend/tests/test_rag.py`.
- **Note/limitation:** no live Garden Guide call was permitted in this checkpoint.

### SCN-15 — Garden Guide grounded success

- **Category:** bounded two-call grounded retrieval.
- **Fictional action/input:** ask which saved fictional activity exists after
  creating one fictional session.
- **Expected:** exactly two calls, read-only row 1 grounding, domain unchanged.
- **Classification:** mock backend with temporary SQLite.
- **Provider calls expected/observed:** 2 / 2.
- **Persistence expected:** one assistant message and two successful lifecycle
  rows with reference 1; no domain mutation.
- **Persistence observed:** calls were `history_sql`, then `history_answer`;
  validated answer cited row 1; domain snapshot matched; messages were ordered
  user 0 then assistant 1; both lifecycle rows stored `[1]`.
- **Result:** Pass.
- **Evidence:** `backend/tests/test_part_3_3_scenarios.py` and
  `backend/tests/test_rag.py`.
- **Note/limitation:** fixed fake rows establish control flow, not live answer
  quality.

## Cross-case behavior conclusions

### A — Support independence: Pass

Support opened after activity interruption and after missing configuration,
timeout, malformed output, and other safe model failures. It made no provider or
save request, retained the underlying failed/custom state, did not resume the
activity, and restored focus to the triggering Support button.

### B — Explicit persistence: Pass

Generation, static output, failure, rejection, duplicate, cancellation, stale
response, and no-match created no unintended saved text. Artifact and Seed writes
required explicit user actions. Target deletion affected only the selected item,
and database snapshots distinguished domain state from factual request lifecycle
records.

### C — Bounded model control: Pass

Observed mock counts were reviewed 0, invalid/missing configuration 0, accepted
Perspective success/failure 1, duplicate 0 additional, Guide rejected/no-match
1, and Guide success 2. Navigation, Support, activity state, saving, and deletion
remained application-controlled. No automatic retry or fallback occurred.

## Live Perspective variation ledger

Exactly four deliberate live submissions produced four provider requests. Each
created one succeeded lifecycle row with attempt count 1. Garden Guide requests
were 0. Artifacts and Seeds remained 0. The disposable database reported
`integrity=ok` and zero foreign-key violations.

The following is validated public application output, not a raw provider payload.

### LIVE A1

**Scenario:** “A fictional classmate read a project update but did not reply
before the group meeting.”

1. **Alternative:** The classmate read the project update and is waiting to
   discuss it live at the meeting.
   - **Reasoning:** The scenario states they read the update but did not reply
     before the group meeting, which could indicate a preference for in-person
     discussion.
   - **Missing context:** We do not know if the classmate planned to bring up
     their thoughts directly during the scheduled meeting time.
2. **Alternative:** The classmate read the update but got distracted before they
   could send a written reply.
   - **Reasoning:** Reading an update does not automatically guarantee that a
     written response was immediately feasible.
   - **Missing context:** We lack information regarding the classmate's schedule
     and availability after they read the message.

- **Reflection question:** What are some different reasons people might choose
  not to reply to a message in writing before a meeting?
- **Limitation:** Coursework prototype; not therapy or medical advice.
- **Meaningful scenario reference:** Yes.
- **Unexpected Alex/static text:** No.
- **Automatically saved:** No.
- **Provider requests:** 1.

### LIVE A2

**Scenario:** same deliberate input as LIVE A1.

1. **Alternative:** The classmate may have seen the update but postponed replying
   until after reviewing additional materials for the meeting.
   - **Reasoning:** The scenario states they read the update and attended or were
     part of the group meeting context without replying beforehand.
   - **Missing context:** Whether the classmate reviewed the rest of the project
     files or intended to respond during the meeting instead.
2. **Alternative:** The classmate might have overlooked sending the drafted reply
   before the meeting started.
   - **Reasoning:** Reading an update does not automatically confirm that a reply
     message was composed or sent prior to the gathering.
   - **Missing context:** Whether the classmate had time to draft a response
     between reading the update and the start of the meeting.

- **Reflection question:** What are the possible reasons someone might read a
  project update without replying immediately?
- **Limitation:** Coursework prototype; not therapy or medical advice.
- **Meaningful scenario reference:** Yes.
- **Unexpected Alex/static text:** No.
- **Automatically saved:** No.
- **Provider requests:** 1.

### LIVE B

**Scenario:** “A fictional teammate changed the presentation order without
explaining why.”

1. **Alternative:** The teammate may have reorganized the slides to improve the
   flow of the presentation.
   - **Reasoning:** The text states the order was changed, which often happens
     during preparation.
   - **Missing context:** The teammate's explicit rationale for the rearrangement
     is not provided.
2. **Alternative:** External time constraints or scheduling needs might have
   prompted the shift.
   - **Reasoning:** Logistical adjustments are common in team presentations.
   - **Missing context:** Details regarding the timeline or meeting constraints
     are absent from the scenario.

- **Reflection question:** What methods might clarify how decisions are made
  within the team?
- **Limitation:** Coursework prototype; not therapy or medical advice.
- **Meaningful scenario reference:** Yes.
- **Unexpected Alex/static text:** No.
- **Automatically saved:** No.
- **Provider requests:** 1.

### LIVE C

**Scenario:** “A fictional instructor returned an assignment with only a request
to revise one section.”

1. **Alternative:** The instructor found the rest of the assignment acceptable
   and only needs that specific section corrected.
   - **Reasoning:** The scenario states the assignment was returned with a request
     to revise only one section.
   - **Missing context:** Whether the instructor reviewed the entire document or
     stopped reading after that section is unknown.
2. **Alternative:** The requested revision might be due to a misunderstanding of
   the prompt in that specific area.
   - **Reasoning:** The instructor singled out one section for revision while
     leaving the rest of the assignment untouched.
   - **Missing context:** The original prompt instructions and the specific
     content of the section in question are not provided.

- **Reflection question:** What specific details or instructions were included
  in the section that was marked for revision?
- **Limitation:** Coursework prototype; not therapy or medical advice.
- **Meaningful scenario reference:** Yes.
- **Unexpected Alex/static text:** No.
- **Automatically saved:** No.
- **Provider requests:** 1.

## Repeated LIVE A comparison

The two responses used different wording and different hypothetical alternatives:
in-person discussion/distraction versus reviewing materials/overlooking a draft.
They were semantically consistent in treating the missing reply as ambiguous and
in identifying unknown timing, availability, and response intent. Neither leaked
the reviewed Alex demonstration or stated a definite motive as established fact.

Both nevertheless introduced hypothetical details absent from the submitted
sentence (distraction, additional materials, and a drafted reply). These were
framed as possibilities and the missing-context fields acknowledged uncertainty,
but the run shows that strict structure cannot establish perfect semantic
grounding.

## Genuinely observed surprising finding

All four outputs passed strict schema and safety validation, yet LIVE B's
reasoning used general claims—“which often happens during preparation” and
“Logistical adjustments are common in team presentations”—that were not in the
submitted fictional text. LIVE A2 also described meeting participation more
strongly than the sentence established. This was not assumed in advance. It
shows a specific gap between structural validation and the instruction that
reasoning be based only on submitted text. The output remained tentative,
relevant, non-clinical, and unsaved, but it should not be described as perfectly
grounded.

## Important untested limitation

No real screen-reader session was performed. The suite checks semantic controls,
focus targets, dialog behavior, and focus restoration in jsdom, but it does not
establish how NVDA, JAWS, VoiceOver, or another assistive technology announces
the moving Focus Garden choices, failed-model state, or generated alternative
cards. Non-English custom scenarios and long-term repeated use were also outside
this checkpoint.

## Automated verification summary

- Focused Perspective/Prompt-13/Guide backend tests: 65 passed with two known
  non-failing dependency deprecation warnings.
- Complete backend: 84 passed with the same two warnings.
- `pip check`: no broken requirements.
- Complete frontend: 28 passed across two files.
- ESLint: passed with zero warnings.
- Production build: passed with 22 modules transformed.

No dependency, database schema, route, model, retry, fallback, Figma, voice/audio,
submitted report, historical prompt, or `main` change was required.
