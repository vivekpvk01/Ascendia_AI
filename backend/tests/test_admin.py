"""
Ascendia AI — Admin API tests

Tests for:
  GET    /api/v1/admin/questions
  POST   /api/v1/admin/questions
  PATCH  /api/v1/admin/questions/{id}
  DELETE /api/v1/admin/questions/{id}

All admin endpoints must reject students (403).
"""

import uuid

import pytest
from fastapi.testclient import TestClient

SIGNUP_URL = "/api/v1/auth/signup"
LOGIN_URL = "/api/v1/auth/login"
ADMIN_Q_URL = "/api/v1/admin/questions"

SAMPLE_QUESTION = {
    "title": "Admin Test Question",
    "statement": "Given an array of integers, find the maximum subarray sum.",
    "difficulty": "medium",
    "topics": ["arrays", "dynamic-programming"],
    "visibility": "public",
    "status": "draft",
}


def _unique_email() -> str:
    return f"admin_{uuid.uuid4().hex[:8]}@example.com"


def _login_as_student(client: TestClient) -> str:
    email = _unique_email()
    client.post(SIGNUP_URL, json={"name": "Student", "email": email, "password": "pass1234"})
    client.post(LOGIN_URL, json={"email": email, "password": "pass1234"})
    return email


class TestAdminAuthEnforcement:
    """Student users must be rejected from all admin endpoints."""

    def test_student_cannot_list_admin_questions(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC
        c = TC(app)
        _login_as_student(c)
        response = c.get(ADMIN_Q_URL)
        assert response.status_code == 403

    def test_student_cannot_create_admin_question(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC
        c = TC(app)
        _login_as_student(c)
        response = c.post(ADMIN_Q_URL, json=SAMPLE_QUESTION)
        assert response.status_code == 403

    def test_unauthenticated_cannot_access_admin(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC
        fresh = TC(app)
        response = fresh.get(ADMIN_Q_URL)
        assert response.status_code == 401

    def test_student_cannot_delete_admin_question(self, client: TestClient) -> None:
        from app.main import app
        from fastapi.testclient import TestClient as TC
        c = TC(app)
        _login_as_student(c)
        # Using a dummy ID — should fail on authorization before reaching the DB
        response = c.delete(f"{ADMIN_Q_URL}/507f1f77bcf86cd799439011")
        assert response.status_code == 403
