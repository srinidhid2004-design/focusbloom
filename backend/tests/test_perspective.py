"""Mocked one-request Perspective workflow and explicit-save boundary tests."""

import json
import sqlite3
from types import SimpleNamespace
from uuid import uuid4

import pytest
from google.genai import errors
from pydantic import SecretStr

from app.config import GEMINI_MODEL, Settings
from app.gemini import (
    GoogleGeminiGateway,
    ProviderProblem,
    _provider_json_schema,
    _safe_api_problem,
)
from app.schemas import GroundedHistoryAnswer, PerspectiveAlternativesOutput


def perspective_payload(key: str | None = None) -> dict:
    return {
        "idempotency_key": key or str(uuid4()),
        "scenario": "The fictional result must have only one explanation.",
    }


def anchored_result(anchor: str) -> dict:
    return {
        "alternatives": [{
            "alternative": "The visible facts allow another explanation.",
            "scenario_anchor": anchor,
            "reasoning": "The submitted event could have more than one cause.",
            "missing_context": "The cause is not stated in the fictional scenario.",
        }],
        "reflection_question": "What other fact would help compare the possibilities?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    }


def test_provider_schema_uses_supported_enum_without_relaxing_validation() -> None:
    perspective_schema = _provider_json_schema(PerspectiveAlternativesOutput)
    grounded_schema = _provider_json_schema(GroundedHistoryAnswer)

    assert "const" not in json.dumps(perspective_schema)
    assert "const" not in json.dumps(grounded_schema)
    assert perspective_schema["properties"]["limitation"]["enum"] == [
        "Coursework prototype; not therapy or medical advice."
    ]
    assert grounded_schema["properties"]["limitation"]["enum"] == [
        "Coursework prototype; factual saved records only."
    ]
    alternative_schema = perspective_schema["$defs"]["PerspectiveAlternative"]
    assert alternative_schema["properties"]["scenario_anchor"]["maxLength"] == 120
    assert "scenario_anchor" in alternative_schema["required"]


def test_google_gateway_sends_json_schema_with_one_attempt(monkeypatch) -> None:
    captured: dict = {}

    class FakeModels:
        def generate_content(self, *, model, contents, config):
            captured.update(model=model, contents=contents, config=config)
            return SimpleNamespace(parsed={
                "alternatives": [{
                    "alternative": "The visible facts allow another explanation.",
                    "scenario_anchor": "fictional interpretation",
                    "reasoning": "The submitted event could have more than one cause.",
                    "missing_context": "The cause is not stated in the fictional scenario.",
                }],
                "reflection_question": "What other fact would help compare the possibilities?",
                "limitation": "Coursework prototype; not therapy or medical advice.",
            })

    class FakeClient:
        def __init__(self, *, api_key, http_options):
            captured.update(api_key_present=bool(api_key), http_options=http_options)
            self.models = FakeModels()

    monkeypatch.setattr("app.gemini.genai.Client", FakeClient)
    output = GoogleGeminiGateway(Settings(gemini_api_key=SecretStr("fictional-test-key"))).perspective({
        "scenario": "A fictional interpretation.",
    })

    assert output.alternatives[0].alternative == "The visible facts allow another explanation."
    assert captured["model"] == GEMINI_MODEL
    assert captured["api_key_present"] is True
    assert captured["http_options"].timeout == 10_000
    assert captured["http_options"].retry_options.attempts == 1
    assert captured["config"].response_schema is None
    assert captured["config"].response_json_schema["properties"]["limitation"]["enum"] == [
        "Coursework prototype; not therapy or medical advice."
    ]


@pytest.mark.parametrize(("code", "safe_code", "status_code"), [
    (400, "invalid_request", 502),
    (401, "authentication_failure", 502),
    (403, "permission_failure", 502),
    (404, "model_not_available", 502),
    (429, "rate_limit_failure", 429),
    (503, "service_unavailable", 502),
    (504, "timeout", 504),
])
def test_provider_status_is_classified_without_raw_detail(code, safe_code, status_code) -> None:
    problem = _safe_api_problem(errors.APIError(code, {"status": "FICTIONAL_STATUS"}))
    assert problem.safe_error_code == safe_code
    assert problem.status_code == status_code


def test_success_uses_one_call_and_does_not_save_artifact(harness_factory) -> None:
    harness = harness_factory()
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 200
    assert response.json()["saved"] is False
    assert len(response.json()["alternatives"]["alternatives"]) == 1
    assert response.json()["alternatives"]["alternatives"][0]["scenario_anchor"] == "fictional"
    assert [call[0] for call in harness.gateway.calls] == ["perspective"]
    assert harness.gateway.calls[0][1] == {
        "scenario": "The fictional result must have only one explanation."
    }
    assert harness.request("GET", "/api/perspective-artifacts").json()["artifacts"] == []


def test_missing_configuration_uses_zero_calls(harness_factory) -> None:
    harness = harness_factory(configured=False)
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 503
    assert response.json()["outcome"] == "missing_configuration"
    assert harness.gateway.calls == []


def test_duplicate_request_never_calls_provider_twice(harness_factory) -> None:
    harness = harness_factory()
    key = str(uuid4())
    assert harness.request("POST", "/api/perspective/alternatives", json=perspective_payload(key)).status_code == 200
    repeated = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload(key))
    assert repeated.json()["outcome"] == "duplicate_request"
    assert len(harness.gateway.calls) == 1


def test_provider_failure_has_one_call_and_sanitized_response(harness_factory) -> None:
    harness = harness_factory()
    harness.gateway.perspective_error = ProviderProblem("provider_failure")
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 502
    assert len(harness.gateway.calls) == 1
    assert "provider_failure" not in response.text


def test_malformed_or_unsafe_output_is_rejected(harness_factory) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = {
        "alternatives": [{
            "alternative": "This will improve your mental health.",
            "scenario_anchor": "fictional",
            "reasoning": "Claim.",
            "missing_context": "Nothing is missing.",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    }
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 502
    assert len(harness.gateway.calls) == 1


def test_more_than_two_generated_alternatives_is_rejected(harness_factory) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = {
        "alternatives": [
            {
                "alternative": f"Bounded alternative {index}.",
                "scenario_anchor": "fictional",
                "reasoning": "Only the supplied fictional text is used.",
                "missing_context": "Other relevant details are not stated.",
            }
            for index in range(3)
        ],
        "reflection_question": "What other context could be relevant?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    }
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 502
    assert len(harness.gateway.calls) == 1


def test_generated_advice_is_rejected(harness_factory) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = {
        "alternatives": [{
            "alternative": "You should take action on the fictional assignment.",
            "scenario_anchor": "fictional",
            "reasoning": "One fictional scenario was supplied.",
            "missing_context": "Other details are not supplied.",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    }
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 502
    assert len(harness.gateway.calls) == 1


def test_invalid_input_uses_zero_calls_and_does_not_echo(harness_factory) -> None:
    harness = harness_factory()
    payload = perspective_payload()
    payload["scenario"] = "private-value" * 40
    response = harness.request("POST", "/api/perspective/alternatives", json=payload)
    assert response.status_code == 422
    assert harness.gateway.calls == []
    assert "private-value" not in response.text


@pytest.mark.parametrize("bad_result", [
    {
        "alternatives": [{
            "alternative": "One possible reading.",
            "scenario_anchor": "fictional",
            "reasoning": "The submitted scenario permits it.",
            "missing_context": "Other context is absent.",
            "unknown": "not allowed",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    },
    {
        "alternatives": [{
            "alternative": "One possible reading.",
            "scenario_anchor": "fictional",
            "reasoning": "x" * 241,
            "missing_context": "Other context is absent.",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    },
    {
        "alternatives": [{
            "alternative": "They definitely intended a particular result.",
            "scenario_anchor": "fictional",
            "reasoning": "The submitted scenario permits it.",
            "missing_context": "Other context is absent.",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    },
    {
        "alternatives": [{
            "alternative": "Alex may have changed the fictional result.",
            "scenario_anchor": "fictional",
            "reasoning": "The classmate left after an idea was shared.",
            "missing_context": "The idea was bad is not established.",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    },
    {
        "alternatives": [{
            "alternative": "One possible reading.",
            "scenario_anchor": "fictional",
            "reasoning": "The submitted scenario permits it.",
        }],
        "reflection_question": "What else is known?",
        "limitation": "Coursework prototype; not therapy or medical advice.",
    },
])
def test_unknown_oversized_unsafe_or_malformed_output_is_rejected(
    harness_factory, bad_result
) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = bad_result
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 502
    assert len(harness.gateway.calls) == 1


def test_unknown_request_field_uses_zero_provider_calls(harness_factory) -> None:
    harness = harness_factory()
    payload = perspective_payload()
    payload["supporting_evidence"] = ["This field is no longer accepted."]
    response = harness.request("POST", "/api/perspective/alternatives", json=payload)
    assert response.status_code == 422
    assert harness.gateway.calls == []


@pytest.mark.parametrize(("scenario", "anchor"), [
    (
        "A fictional teammate changed the presentation order without explaining why.",
        "changed the presentation order",
    ),
    (
        "A fictional teammate changed the presentation order without explaining why.",
        "FICTIONAL TEAMMATE",
    ),
    (
        "A fictional teammate changed   the presentation order without explaining why.",
        "teammate changed the presentation order",
    ),
    (
        "A fictional team used a ＦＵＬＬＷＩＤＴＨ label.",
        "a fullwidth label",
    ),
])
def test_scenario_anchor_matches_after_deterministic_normalization(
    harness_factory, scenario, anchor
) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = anchored_result(anchor)
    payload = perspective_payload()
    payload["scenario"] = scenario
    response = harness.request("POST", "/api/perspective/alternatives", json=payload)
    assert response.status_code == 200
    assert response.json()["alternatives"]["alternatives"][0]["scenario_anchor"] == anchor
    assert [call[0] for call in harness.gateway.calls] == ["perspective"]


@pytest.mark.parametrize("anchor", [
    "the meeting started late",
    "reordered the slides",
])
def test_absent_or_paraphrased_scenario_anchor_is_rejected_without_retry_or_save(
    harness_factory, anchor
) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = anchored_result(anchor)
    payload = perspective_payload()
    payload["scenario"] = "A fictional teammate changed the presentation order without explaining why."
    response = harness.request("POST", "/api/perspective/alternatives", json=payload)
    assert response.status_code == 502
    assert response.json()["outcome"] == "model_failure"
    assert [call[0] for call in harness.gateway.calls] == ["perspective"]
    assert harness.request("GET", "/api/perspective-artifacts").json()["artifacts"] == []
    assert harness.request("GET", "/api/next-step-seeds").json()["seeds"] == []


@pytest.mark.parametrize("anchor", ["", "x" * 121])
def test_empty_or_oversized_scenario_anchor_is_rejected(harness_factory, anchor) -> None:
    harness = harness_factory()
    harness.gateway.perspective_result = anchored_result(anchor)
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == 502
    assert [call[0] for call in harness.gateway.calls] == ["perspective"]


def test_lifecycle_table_stores_neither_scenario_nor_anchor_text(harness_factory) -> None:
    harness = harness_factory()
    scenario = "A fictional sapphire folder changed before the workshop."
    anchor = "sapphire folder changed"
    harness.gateway.perspective_result = anchored_result(anchor)
    payload = perspective_payload()
    payload["scenario"] = scenario
    assert harness.request("POST", "/api/perspective/alternatives", json=payload).status_code == 200
    with sqlite3.connect(harness.database_path) as connection:
        columns = [row[1] for row in connection.execute("PRAGMA table_info(model_requests)")]
        rows = connection.execute("SELECT * FROM model_requests").fetchall()
    assert "scenario" not in columns
    assert "scenario_anchor" not in columns
    serialized = json.dumps(rows)
    assert scenario not in serialized
    assert anchor not in serialized
