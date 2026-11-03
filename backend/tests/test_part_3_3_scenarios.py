"""Prompt 13 cross-case scenario records and persistence snapshots."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any
from uuid import uuid4

import pytest

from app.gemini import ProviderProblem
from app.schemas import HistoryQueryProposal
from conftest import create_conversation, create_history_request, create_session


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "part_3_3_scenarios.json"
DOMAIN_TABLES = (
    "demo_profiles", "preferences", "activity_sessions", "activity_events",
    "perspective_artifacts", "next_step_seeds",
)
ALL_TABLES = DOMAIN_TABLES + ("conversations", "messages", "model_requests")


def snapshot(database_path: Path, tables: tuple[str, ...] = ALL_TABLES) -> dict[str, list[tuple[Any, ...]]]:
    with sqlite3.connect(database_path) as connection:
        return {
            table: connection.execute(f"SELECT * FROM {table} ORDER BY rowid").fetchall()
            for table in tables
        }


def perspective_payload(key: str | None = None) -> dict[str, str]:
    return {
        "idempotency_key": key or str(uuid4()),
        "scenario": "A fictional project folder changed before a workshop.",
    }


def artifact_payload(label: str) -> dict[str, Any]:
    return {
        "client_artifact_id": str(uuid4()),
        "session_id": None,
        "interpretation_text": f"A fictional interpretation {label}.",
        "supporting_evidence": [],
        "uncertainty": [],
        "alternative_text": f"A reviewed alternative {label}.",
        "alternative_source": "user",
        "observer_mode": "none",
    }


def test_fixture_records_all_fifteen_required_scenarios() -> None:
    records = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert [record["id"] for record in records] == [f"SCN-{index:02d}" for index in range(1, 16)]
    required = {
        "id", "category", "fictional_action", "expected", "classification",
        "expected_provider_calls", "expected_persistence", "evidence_ref",
    }
    assert all(set(record) == required for record in records)
    assert all(record["classification"] == "mock" for record in records)


def test_generation_then_selective_artifact_and_seed_deletion(harness_factory) -> None:
    harness = harness_factory()
    assert harness.request("GET", "/api/health").status_code == 200
    before = snapshot(harness.database_path)
    generated = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert generated.status_code == 200
    assert generated.json()["saved"] is False
    assert harness.request("GET", "/api/perspective-artifacts").json()["artifacts"] == []
    assert snapshot(harness.database_path, DOMAIN_TABLES) == {
        table: before[table] for table in DOMAIN_TABLES
    }

    first = harness.request("POST", "/api/perspective-artifacts", json=artifact_payload("one"))
    second = harness.request("POST", "/api/perspective-artifacts", json=artifact_payload("two"))
    assert first.status_code == second.status_code == 201
    first_id = first.json()["artifact"]["artifact_id"]
    second_id = second.json()["artifact"]["artifact_id"]
    deleted = harness.request("DELETE", f"/api/perspective-artifacts/{first_id}")
    assert deleted.status_code == 200
    remaining = harness.request("GET", "/api/perspective-artifacts").json()["artifacts"]
    assert [artifact["artifact_id"] for artifact in remaining] == [second_id]

    seed = harness.request("POST", "/api/next-step-seeds", json={
        "client_seed_id": str(uuid4()),
        "session_id": None,
        "situation_text": "a fictional workshop begins",
        "action_text": "read the visible instructions",
        "formatted_plan": "If a fictional workshop begins, then I will read the visible instructions.",
        "source": "template",
    })
    assert seed.status_code == 201
    assert harness.request(
        "DELETE", f"/api/next-step-seeds/{seed.json()['seed']['seed_id']}"
    ).status_code == 200
    assert [
        artifact["artifact_id"]
        for artifact in harness.request("GET", "/api/perspective-artifacts").json()["artifacts"]
    ] == [second_id]
    assert harness.request("GET", "/api/next-step-seeds").json()["seeds"] == []
    assert [call[0] for call in harness.gateway.calls] == ["perspective"]


@pytest.mark.parametrize("problem", [
    ProviderProblem("timeout", 504),
    ProviderProblem("provider_failure", 502),
    ProviderProblem("malformed_response", 502),
])
def test_failed_perspective_changes_only_lifecycle_state(harness_factory, problem) -> None:
    harness = harness_factory()
    assert harness.request("GET", "/api/health").status_code == 200
    before = snapshot(harness.database_path)
    harness.gateway.perspective_error = problem
    response = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload())
    assert response.status_code == problem.status_code
    assert response.json()["outcome"] == "model_failure"
    assert len(harness.gateway.calls) == 1
    after = snapshot(harness.database_path)
    assert {table: after[table] for table in DOMAIN_TABLES} == {
        table: before[table] for table in DOMAIN_TABLES
    }
    assert after["conversations"] == before["conversations"]
    assert after["messages"] == before["messages"]
    assert len(after["model_requests"]) == len(before["model_requests"]) + 1
    request = after["model_requests"][-1]
    assert request[7] == "failed"
    assert request[11] == 1


def test_duplicate_perspective_is_byte_for_byte_persistence_stable(harness_factory) -> None:
    harness = harness_factory()
    key = str(uuid4())
    assert harness.request("POST", "/api/perspective/alternatives", json=perspective_payload(key)).status_code == 200
    before_repeat = snapshot(harness.database_path)
    repeated = harness.request("POST", "/api/perspective/alternatives", json=perspective_payload(key))
    assert repeated.json()["outcome"] == "duplicate_request"
    assert snapshot(harness.database_path) == before_repeat
    assert len(harness.gateway.calls) == 1


@pytest.mark.parametrize("outcome", ["mutation", "no_match"])
def test_guide_rejection_or_no_match_preserves_domain_snapshot(harness_factory, outcome) -> None:
    harness = harness_factory()
    if outcome == "mutation":
        create_session(harness)
        harness.gateway.query_result = HistoryQueryProposal(
            outcome="query",
            intent="Attempt a mutation that must be rejected.",
            sql="DELETE FROM activity_sessions WHERE profile_id=:profile_id LIMIT 20",
            parameters={},
        )
    conversation_id = create_conversation(harness)
    request_id = create_history_request(harness, conversation_id)
    before_domain = snapshot(harness.database_path, DOMAIN_TABLES)
    before_messages = snapshot(harness.database_path, ("messages",))["messages"]
    response = harness.request(
        "POST", "/api/garden-guide/history-questions", json={"request_id": request_id}
    )
    assert response.json()["outcome"] == (
        "history_query_rejected" if outcome == "mutation" else "history_no_match"
    )
    assert [call[0] for call in harness.gateway.calls] == ["history_sql"]
    assert snapshot(harness.database_path, DOMAIN_TABLES) == before_domain
    assert snapshot(harness.database_path, ("messages",))["messages"] == before_messages


def test_guide_success_changes_only_grounded_message_lifecycle(harness_factory) -> None:
    harness = harness_factory()
    create_session(harness)
    conversation_id = create_conversation(harness)
    request_id = create_history_request(harness, conversation_id)
    before_domain = snapshot(harness.database_path, DOMAIN_TABLES)
    response = harness.request(
        "POST", "/api/garden-guide/history-questions", json={"request_id": request_id}
    )
    assert response.status_code == 200
    assert response.json()["answer"]["content"] == "Row 1 records one fictional activity session."
    assert response.json()["row_references"] == [1]
    assert [call[0] for call in harness.gateway.calls] == ["history_sql", "history_answer"]
    assert snapshot(harness.database_path, DOMAIN_TABLES) == before_domain
    messages = harness.request(
        "GET", f"/api/conversations/{conversation_id}/messages"
    ).json()["messages"]
    assert [(message["ordinal"], message["role"]) for message in messages] == [
        (0, "user"), (1, "assistant")
    ]
    with sqlite3.connect(harness.database_path) as connection:
        assert connection.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
        assert connection.execute("PRAGMA foreign_key_check").fetchall() == []
        requests = connection.execute(
            "SELECT purpose,status,attempt_count,retrieved_row_refs_json "
            "FROM model_requests ORDER BY created_at"
        ).fetchall()
    assert requests == [
        ("history_sql", "succeeded", 1, "[1]"),
        ("history_answer", "succeeded", 1, "[1]"),
    ]
