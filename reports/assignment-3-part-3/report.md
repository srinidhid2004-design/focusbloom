# FocusBloom — Assignment 3.3 Final Report

## 1. Project identification

**Project:** FocusBloom

**Coursework milestone:** Assignment 3.3

**Public repository:** [github.com/srinidhid2004-design/focusbloom](https://github.com/srinidhid2004-design/focusbloom)

**Assignment 3.3 feature branch:** [`feature/assignment-3-part-3`](https://github.com/srinidhid2004-design/focusbloom/tree/feature/assignment-3-part-3)

Relevant assessed commits:

- [Dynamic Perspective and continuing Focus Garden implementation](https://github.com/srinidhid2004-design/focusbloom/commit/8c463b99f5af2c9bb002dc939be5de3dd25bd2b8)
- [Fifteen-scenario evaluation](https://github.com/srinidhid2004-design/focusbloom/commit/b8dad5cfb53e74591e3ef0d42f7baf2e10a855b8)
- [Perspective grounding hardening](https://github.com/srinidhid2004-design/focusbloom/commit/d15670b08fe8ea693baad72f7af83327defc1072)
- [Clean-checkout README correction](https://github.com/srinidhid2004-design/focusbloom/commit/f1148e36a100fa27f39979c6a3de4e013352568d)
- [Independent clean-checkout verification record](https://github.com/srinidhid2004-design/focusbloom/commit/4099d39c7067ba1ed2ac761492d1f15484ac2568)

FocusBloom is a fictional local coursework prototype combining optional visual-attention activities, a structured perspective exercise, optional user-authored plans, factual history, and a bounded Gemini assistant. It is not therapy, diagnosis, crisis detection, monitoring, medical advice, or evidence of attention, emotion, improvement, clinical safety, or effectiveness.

## 2. Completed application and refinement

I completed the application as a low-input, application-controlled experience. Focus Garden presents one visible search task at a time. A correct choice begins another round, moves the correct target, and focuses the refreshed group. The activity remains active until the user explicitly chooses **Stop** or the neutral **Skip this** action. There is no score, rank, streak, penalty, or failure label.

Perspective Studio separates a provider-free reviewed fictional demonstration from a genuinely dynamic custom route. The reviewed Alex path is pre-written and makes zero provider calls. The custom path sends only an idempotency UUID and one normalized fictional scenario after an explicit Generate action. Strict structured output permits one or two tentative alternatives, each with an exact scenario anchor, reasoning, and missing context, plus one reflection question and the fixed coursework limitation. The interface displays **AI-generated draft — review before saving.**, the original scenario, and a warning that structured output may still introduce assumptions.

The user controls selection, editing, rejection, creating an alternative, and explicit artifact saving. Next-Step Seed is separately user-authored: the user writes an if–then plan, previews it, and explicitly saves it. Gemini does not choose the action. History Garden presents factual records, selective artifact and Seed deletion, and a confirmed fictional-profile reset. Garden Guide is read-only and may answer only from validated bounded saved-history rows. Static Support remains independently available without Gemini, SQLite, classification, or network success. Motion mode, guidance, and difficulty are explicit, reversible preferences.

## 3. Saved history and personalization

The persistence boundary is deliberately visible:

- Focus Garden automatically stores factual activity metadata such as activity type, status, timestamps, duration, difficulty, motion mode, guidance, and factual events.
- User preferences are stored only after the interface explains what will be remembered; they remain editable and resettable.
- Generated Perspective text remains unsaved by default in frontend memory.
- A Perspective artifact exists only after the user reviews a selected or edited alternative and chooses **Save**.
- A Next-Step Seed is authored separately by the user, previewed, and saved through its own explicit action.
- Garden Guide reads validated factual saved history; it does not control or rewrite it.
- Saved Perspective text and Seeds can be deleted selectively. A separate confirmed reset clears the fictional profile.

The system does not store mood scores, diagnoses, inferred emotions, inferred crisis state, hidden attention scores, or claims that the application worked.

## 4. Part 3.1 decisions revisited

The submitted Part 3.1 design centered a paced breathing activity. A later classroom comparison showed that multiple projects used nearly identical breathing-centered interactions. I therefore retained the approved blue/green water-garden visual direction but changed the active product to FocusBloom: visual-attention Focus Garden activities and the structured Perspective Studio. I did not make grounding exercises the central interaction because classmates had also used that direction. This classroom observation is design input, not research or effectiveness evidence.

The final interface continues the original low-input intention. Focus Garden requires no typing, and Perspective Studio includes a complete fictional demonstration. The reviewed Alex path was separated from the genuinely dynamic custom route so demonstration-specific evidence could not leak into a custom request. Runtime implementation also added flexible content height, explicit heading focus, Support focus restoration, deterministic cancellation/stale-response guards, and literal failure copy that a static Figma reference could not prove.

The most important refinement came from implementation testing. A live result passed strict structural validation while still adding unsupported general claims. In response, I added an exact scenario anchor, preserved the visible AI-draft and assumption warnings, and retained explicit review and Save boundaries. An exact quotation improves comparison with the input; it does not guarantee complete semantic grounding.

## 5. Fifteen fictional scenarios

The full evidence ledger is in [Assignment 3.3 fifteen-scenario evaluation](https://github.com/srinidhid2004-design/focusbloom/blob/main/docs/part-3-3-evaluation.md). “Mocked” below means fake credentials, an injected gateway or stubbed fetch, and disposable SQLite databases. The four live entries were confined to the Perspective variation ledger; no live Garden Guide request was made.

| # | Scenario | Expected | Observed | Evidence type |
| ---: | --- | --- | --- | --- |
| 1 | Continuing Focus Garden rounds and moving target | Correct choices keep the activity active and move the target | Correct index moved 1 → 2 → 0; no completion PATCH/event; refreshed group received focus | Mocked frontend |
| 2 | Explicit Stop | Only the user’s Stop action ends the run | No earlier terminal update; one `stop` PATCH after selection | Mocked frontend |
| 3 | Neutral Skip | Skip without score, penalty, or failure wording | `skip` update and `skipped` event; neutral visible copy | Mocked frontend |
| 4 | Support independence and focus restoration | No provider/save action, no hidden resume, return focus to trigger | Activity was interrupted, failed custom state was retained, no request/save was added, and focus returned | Mocked frontend |
| 5 | Provider-free reviewed Alex demonstration | Reviewed content, zero provider calls, no automatic save | No alternatives request or artifact POST; reviewed source label displayed | Static/mocked frontend |
| 6 | Custom Perspective scenario A | Scenario-only request, one bounded result, no artifact | Request contained only `idempotency_key` and normalized `scenario`; one call; no save | Mocked full stack |
| 7 | Distinct custom Perspective scenario B | Different fictional inputs produce distinct bounded drafts | Open-window and moved-lamp fixtures remained distinct; neither saved | Mocked frontend |
| 8 | Explicit artifact save and selective deletion | Generation saves nothing; explicit saves create artifacts; selected delete is isolated | Two explicit saves followed by one targeted deletion left the other artifact intact | Mocked full stack |
| 9 | User-authored Seed save and deletion | No write before Preview/Save; Seed deletion does not delete artifacts | Exact user situation/action saved only after Save; targeted deletion was isolated | Mocked full stack |
| 10 | Missing Gemini configuration | Zero provider attempts, preserved input, no saved text | Gateway was uncalled; one zero-attempt lifecycle failure; no artifact | Mocked full stack |
| 11 | Timeout/provider failure with zero retry | One attempt, zero retry, safe UI, no saved text | One failed attempt-count-1 row; domain/message snapshots unchanged; Support available | Mocked full stack |
| 12 | Malformed, unsafe, or oversized output | Strict rejection after one attempt and no automatic save | Extra, oversized, unsafe, unknown, Alex-specific, and missing-field output was rejected with sanitized copy | Mocked backend |
| 13 | Duplicate, cancelled, and stale-response protection | Duplicate adds no call/write; late response cannot overwrite current state | Duplicate snapshot stayed byte-for-byte stable; late text did not render or save | Mocked full stack |
| 14 | Garden Guide rejection/no-match | One SQL-proposal call, no answer call, no domain mutation | Mutation rejected before execution; zero rows produced fixed no-match copy; one call | Mocked backend |
| 15 | Two-call grounded Garden Guide success | Exactly two calls, validated rows/references, read-only domain state | `history_sql` then `history_answer`; reference 1 validated; ordered assistant message persisted; domain snapshot unchanged | Mocked backend |

The live variation portion submitted the same fictional scenario twice and two different fictional scenarios once each. All four responses were accepted in one request apiece and remained unsaved. Their wording and hypothetical alternatives varied while preserving uncertainty. These observations evaluate response variation and control flow only.

## 6. Three explicit behavior checks

| Behavior | Expected | Observed |
| --- | --- | --- |
| Support after model failure | Support remains available and does not depend on a provider | Missing configuration, timeout, malformed output, and other provider-failure states retained Support, made no additional request, preserved the underlying state, and restored focus |
| Generated text persistence | Generated text is never persisted without an explicit user action | Generation, rejection, failure, duplicate, cancellation, stale response, and no-match created no artifact or Seed; only explicit Save actions changed saved-text tables |
| Application control | Navigation, activity state, saving, deletion, and Support remain deterministic application behavior | Mocked call counts remained 0/1/2 as contracted, while Vue/FastAPI—not Gemini—owned navigation, evaluation, state transitions, transactions, deletion, and Support |

## 7. Live-model evaluation

The Prompt 13 variation ledger contains exactly four live Perspective submissions and exactly four provider requests. Each succeeded in one attempt. There were zero retries, no provider/model fallback, no live Garden Guide request, and no automatically saved artifact or Seed. The repeated scenario produced different tentative alternatives and wording; the two different scenarios produced clearly different bounded drafts.

Prompt 14 later performed one separately authorized anchored UI check to verify the new anchor contract. It is grounding-refinement evidence, not part of the four-submission variation ledger. This finalization made no new live request.

## 8. Surprising finding and resulting decision

LIVE B passed strict structural validation but included unsupported general statements: “which often happens during preparation” and “Logistical adjustments are common in team presentations.” This showed that schema validity does not guarantee semantic grounding.

I responded by requiring each custom alternative to return a short exact `scenario_anchor`. The backend applies NFKC normalization, collapses whitespace, case-folds the anchor and scenario, and requires the normalized anchor to be a literal substring. The UI still labels the result as an AI draft, warns that assumptions may remain, displays the original scenario, and requires explicit review and Save. Scenario-anchor validation helps reviewability; it does not guarantee that every generated statement is factually supported.

## 9. Limitations not tested

Real screen-reader operation remains untested. Semantic controls, focus targets, dialog behavior, and focus restoration were tested in jsdom and inspected in the browser, but this does not establish how NVDA, JAWS, VoiceOver, or another assistive technology announces every state. Non-English scenarios and long-term repeated use were also not tested.

## 10. Clean-checkout verification

The first independent public checkout correctly contained none of the developer environment, API key, runtime database, dependencies, build output, or caches. It exposed incomplete README instructions: the first check referenced a nonexistent virtual environment and setup, installation, database initialization, startup, and health steps were missing. I stopped rather than silently compensating and corrected the README.

A second independent public checkout followed the corrected README. It created a fresh Python environment, installed declared requirements and pinned test tools, used `npm ci`, initialized a new schema-version-2 database, ran 93 backend tests and 28 frontend tests, passed `pip check`, ESLint, and the production build, started FastAPI and Vue, and returned safe health with the database available and Gemini not configured. The no-key path verified continuing Focus rounds, the provider-free reviewed example, independent Support, preserved custom input, and safe missing-configuration behavior. This demonstrated that another person can run the project from a clean public checkout without copying local credentials or generated state.

## 11. Recordings

- [Finished-application demonstration — PolishedDemo.mp4](https://drive.google.com/file/d/1NOoCNPntjhuIkGoTXebhecTpugK4Zg28/view?usp=sharing) — demonstrates the completed FocusBloom flows, explicit persistence, factual history, bounded Guide behavior, and independent Support with fictional content.
- [Process/failure/evidence/code screencast — CodeDemoExplanation.mp4](https://drive.google.com/file/d/1sKYhp84QHkIQUOjFh-piDj1nAfjkcZqs/view?usp=sharing) — explains the surprising unsupported-generalization finding, the evidence, the scenario-anchor decision, relevant validation code/tests, and the remaining limitation.

Both public Drive pages were rechecked without an authenticated Google session. They returned their expected public titles and did not show a permission-request page. The automated embedded player could not decode playback, so the public page/title/access check is distinct from the manual recording review.

## 12. AI and safety boundaries

- Gemini configuration and calls are backend-only.
- The model is fixed to `gemini-3.5-flash-lite` with a ten-second timeout, one SDK attempt, zero automatic retries, and no provider/model fallback.
- Gemini cannot control navigation, Focus Garden evaluation/state, saving, deletion, reset, or Support.
- Generated Perspective text is not persisted automatically.
- Garden Guide uses a validated read-only SQL proposal and a grounded answer only when bounded rows exist.
- Static Support does not depend on Gemini, SQLite, classification, geolocation, or network success.
- Testing uses fictional scenarios and records; it is not therapy or medical advice and does not validate clinical safety or effectiveness.

## 13. Final verification summary

Final feature-branch verification used the project’s existing environments with the Gemini environment explicitly blank. No live provider request or existing runtime database was used.

| Evidence class | Final observed result |
| --- | --- |
| Mocked automated backend | 93 tests passed; 74 focused Perspective/grounding/scenario/Guide tests passed; two known non-failing dependency deprecation warnings |
| Backend dependency integrity | `pip check`: no broken requirements |
| Disposable schema/API | Schema version 2; integrity `ok`; zero foreign-key violations; nine expected tables; 22 OpenAPI operations |
| Mocked frontend | 28 tests passed across two files |
| ESLint | Passed with zero warnings |
| Production build | Passed; 22 modules transformed |
| Production dependency audit | `npm audit --omit=dev`: 0 vulnerabilities |
| Existing live evidence | Prompt 13: four Perspective submissions/four requests, zero retries/fallbacks, zero live Guide calls, zero automatic saves; Prompt 14: one separately authorized anchored check |
| Clean public checkout | README-only setup, schema initialization, full checks, service startup, safe no-key health, and required no-key UI path passed |
| Manual evidence | Two public recording pages and seven official Support destinations were rechecked; no form, call, text, chat, search, location, or personal data was submitted |
| Remaining limits | Real screen-reader use, non-English scenarios, and long-term repeated use remain untested |

The two warnings are upstream deprecations in Starlette’s current `httpx` TestClient bridge and a Google SDK Python typing alias. They did not fail the suite. The earlier clean checkout’s `npm ci` reported 11 moderate all-dependency findings; the required final production-only audit reports zero vulnerabilities. No automatic audit fix or dependency change was made.

## 14. Submission statement

Canvas submission remains a manual human action. Upload exactly:

`reports/assignment-3-part-3/report.md`
