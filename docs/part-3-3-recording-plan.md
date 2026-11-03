# Assignment 3.3 demonstration and process-screencast plan

## Format and boundary

Use one approximately ten-minute course recording with two clearly titled
sections. A two-file version may use the same section boundaries. This is an
external coursework screencast plan; it adds no microphone, voice, audio, or
recording feature or dependency to FocusBloom.

Use only fictional data. Hide browser bookmarks, notifications, local paths,
environment files, terminal history, credentials, and provider/network details.
Do not show raw provider payloads or errors. Record at a readable 1024×768 or
larger viewport, zoom enough for literal labels, and pause briefly after each
state change.

## Section 1 — finished application demonstration

Target: 6 minutes 15 seconds.

| Time | Screen/action | Approximate speaking points |
| --- | --- | --- |
| 0:00–0:30 | Entry and optional preferences | “FocusBloom is a fictional coursework prototype, not therapy or medical advice. The primary path needs no typing; preferences are optional, explained, and reversible.” |
| 0:30–1:20 | Focus Garden: correct choice, moved target, Stop | “A correct answer begins another round rather than ending the activity. The correct target moves and the refreshed group receives focus. Only the user's Stop action ends this run; there is no score or penalty.” |
| 1:20–1:50 | Reviewed Alex demonstration | “This Alex path is pre-written reviewed material. It uses zero provider requests and is labeled as a reviewed fictional example.” |
| 1:50–3:10 | Custom fictional scenario and accepted output | Show the exact request preview, then the already-authorized result. “The application sends only this fictional scenario. Each draft shows an exact scenario anchor, tentative alternative, reasoning, missing context, reflection question, limitation, and the AI-draft warning. A matching anchor reduces one risk but does not prove every claim.” |
| 3:10–3:45 | Select, edit/reject controls, explicit artifact Save | “Nothing is selected or saved automatically. The user can edit, reject, or create an alternative. This Save is a separate reviewed action.” |
| 3:45–4:20 | Optional user-authored Next-Step Seed | “The Seed is optional and user-authored. Preview occurs before its separate Save; the model does not choose an action.” |
| 4:20–5:05 | History Garden and one factual Garden Guide answer | “History contains factual metadata and explicitly saved text. Garden Guide is limited to validated read-only saved-history retrieval and grounded row references.” |
| 5:05–5:40 | Selective deletion | Delete only the selected fictional artifact or Seed. “Deletion affects only the chosen saved item; factual session metadata remains understandable.” |
| 5:40–6:05 | Independent Support | Open and return from Support. “Support is static and usable without Gemini, history, or network success. Returning does not restart an activity or request.” |
| 6:05–6:15 | Boundary close | “This demonstrates software behavior with fictional records. It is not evidence of therapy, attention change, clinical safety, or effectiveness.” |

Do not make a fresh provider request merely for the recording. Use the approved
fictional result or a clearly labeled deterministic demonstration unless a later
task separately authorizes another bounded live call.

## Section 2 — process screencast

Target: 3 minutes 45 seconds.

| Time | Evidence/code/test | Approximate speaking points |
| --- | --- | --- |
| 0:00–0:35 | Prompt 13 LIVE B input and validated output in `docs/part-3-3-evaluation.md` | “The fictional input said only that a teammate changed the presentation order without explaining why. The accepted output added general claims about preparation and logistics.” |
| 0:35–1:05 | Prompt 13 finding | State exactly: “Structural schema validation did not guarantee complete semantic grounding.” Explain that valid JSON shape and safe wording did not prove every claim came from the input. |
| 1:05–1:45 | Grounding decision and finished UI | Show `scenario_anchor`, the visible quotation, draft label, warning, and explicit Save. “The result is easier to compare with the original scenario and remains tentative and unsaved.” |
| 1:45–2:50 | `PerspectiveAlternative`, `_normalize_scenario_text`, and `validate_perspective` | “The backend applies NFKC, collapses whitespace, and case-folds both texts. The normalized anchor must be a literal substring. A fabricated or paraphrased anchor becomes one sanitized malformed response. The same request ends there—no second model call, retry, or fallback.” |
| 2:50–3:20 | Focused anchor tests passing | Show the focused test command and passing count. Point out exact/case/whitespace/NFKC acceptance, absent/paraphrase/empty/oversized rejection, and no-save/lifecycle assertions. |
| 3:20–3:45 | Remaining limitation | “A matching quotation does not prove every generated claim is supported. The warning, review controls, and explicit Save remain necessary.” |

## Recording checklist

- Start from a clean fictional state and rehearse without submitting a provider
  request.
- Show headings, keyboard focus, and literal labels; avoid rapid navigation.
- Keep the scenario visible when discussing its anchor.
- Show one explicit Save and one selective Delete, not a destructive full reset.
- Do not expose environment contents, keys, private paths, raw provider material,
  real-person data, or browser developer/network panels.
- End each section with the coursework and remaining-limitation statement.
