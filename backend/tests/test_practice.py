"""
Ascendia AI — Practice Question API tests

Tests for:
  GET    /api/v1/practice
  GET    /api/v1/practice/{id}
  POST   /api/v1/practice
  PATCH  /api/v1/practice/{id}
  DELETE /api/v1/practice/{id}
"""

import uuid

import pytest
from fastapi.testclient import TestClient

SIGNUP_URL = "/api/v1/auth/signup"
LOGIN_URL = "/api/v1/auth/login"
PRACTICE_URL = "/api/v1/practice"


def _unique_email() -> str:
    return f"pq_{uuid.uuid4().hex[:8]}@example.com"


def _register_and_login(client: TestClient) -> dict:
    email = _unique_email()
    password = "testpass123"
    client.post(SIGNUP_URL, json={"name": "Test Student", "email": email, "password": password})
    client.post(LOGIN_URL, json={"email": email, "password": password})
    return {"email": email}


SAMPLE_QUESTION = {
    "title": "Two Sum Problem",
    "statement": "Given an array of integers nums and a target, return the indices of the two numbers that add up to target.",
    "difficulty": "easy",
    "topics": ["arrays", "hash-map"],
    "visibility": "private",
}


class TestPracticeList:
    def test_requires_auth(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC
        fresh = TC(app)
        response = fresh.get(PRACTICE_URL)
        assert response.status_code == 401

    def test_returns_own_questions(self, client: TestClient) -> None:
        _register_and_login(client)
        client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        response = client.get(PRACTICE_URL)
        assert response.status_code == 200
        assert response.json()["success"] is True
        assert isinstance(response.json()["data"], list)


class TestPracticeCreate:
    def test_create_success(self, client: TestClient) -> None:
        _register_and_login(client)
        response = client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        assert response.status_code == 201
        body = response.json()
        assert body["success"] is True
        data = body["data"]
        assert data["title"] == SAMPLE_QUESTION["title"]
        assert data["source_type"] == "user"  # Always 'user' from student endpoint
        assert data["visibility"] == "private"
        assert data["status"] == "draft"

    def test_create_requires_title(self, client: TestClient) -> None:
        _register_and_login(client)
        bad = dict(SAMPLE_QUESTION)
        bad.pop("title")
        response = client.post(PRACTICE_URL, json=bad)
        assert response.status_code == 422

    def test_create_requires_auth(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC
        fresh = TC(app)
        response = fresh.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        assert response.status_code == 401


class TestPracticeGet:
    def test_get_own_private_question(self, client: TestClient) -> None:
        _register_and_login(client)
        create_res = client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        qid = create_res.json()["data"]["id"]
        response = client.get(f"{PRACTICE_URL}/{qid}")
        assert response.status_code == 200
        assert response.json()["data"]["id"] == qid

    def test_cannot_get_other_users_private_question(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC

        # User A creates a private question
        a_client = TC(app)
        email_a = _unique_email()
        a_client.post(SIGNUP_URL, json={"name": "A", "email": email_a, "password": "pass1234"})
        a_client.post(LOGIN_URL, json={"email": email_a, "password": "pass1234"})
        create_res = a_client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        qid = create_res.json()["data"]["id"]

        # User B tries to access it
        b_client = TC(app)
        email_b = _unique_email()
        b_client.post(SIGNUP_URL, json={"name": "B", "email": email_b, "password": "pass1234"})
        b_client.post(LOGIN_URL, json={"email": email_b, "password": "pass1234"})
        response = b_client.get(f"{PRACTICE_URL}/{qid}")
        assert response.status_code == 403


class TestPracticeUpdate:
    def test_update_own_question(self, client: TestClient) -> None:
        _register_and_login(client)
        create_res = client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        qid = create_res.json()["data"]["id"]
        response = client.patch(f"{PRACTICE_URL}/{qid}", json={"title": "Updated Title"})
        assert response.status_code == 200
        assert response.json()["data"]["title"] == "Updated Title"

    def test_cannot_update_other_users_question(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC

        a_client = TC(app)
        email_a = _unique_email()
        a_client.post(SIGNUP_URL, json={"name": "A", "email": email_a, "password": "pass1234"})
        a_client.post(LOGIN_URL, json={"email": email_a, "password": "pass1234"})
        create_res = a_client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        qid = create_res.json()["data"]["id"]

        b_client = TC(app)
        email_b = _unique_email()
        b_client.post(SIGNUP_URL, json={"name": "B", "email": email_b, "password": "pass1234"})
        b_client.post(LOGIN_URL, json={"email": email_b, "password": "pass1234"})
        response = b_client.patch(f"{PRACTICE_URL}/{qid}", json={"title": "Hijacked"})
        assert response.status_code == 403


class TestPracticeDelete:
    def test_delete_own_question(self, client: TestClient) -> None:
        _register_and_login(client)
        create_res = client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        qid = create_res.json()["data"]["id"]
        response = client.delete(f"{PRACTICE_URL}/{qid}")
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_cannot_delete_other_users_question(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC

        a_client = TC(app)
        email_a = _unique_email()
        a_client.post(SIGNUP_URL, json={"name": "A", "email": email_a, "password": "pass1234"})
        a_client.post(LOGIN_URL, json={"email": email_a, "password": "pass1234"})
        create_res = a_client.post(PRACTICE_URL, json=SAMPLE_QUESTION)
        qid = create_res.json()["data"]["id"]

        b_client = TC(app)
        email_b = _unique_email()
        b_client.post(SIGNUP_URL, json={"name": "B", "email": email_b, "password": "pass1234"})
        b_client.post(LOGIN_URL, json={"email": email_b, "password": "pass1234"})
        response = b_client.delete(f"{PRACTICE_URL}/{qid}")
        assert response.status_code == 403
