"""
Ascendia AI — Auth endpoint tests

Tests for:
  POST /api/v1/auth/signup
  POST /api/v1/auth/login
  POST /api/v1/auth/logout
  GET  /api/v1/auth/me

These tests use the real FastAPI test client with the real database.
Each test uses a unique email to avoid conflicts.
"""

import uuid

import pytest
from fastapi.testclient import TestClient

SIGNUP_URL = "/api/v1/auth/signup"
LOGIN_URL = "/api/v1/auth/login"
LOGOUT_URL = "/api/v1/auth/logout"
ME_URL = "/api/v1/auth/me"


def _unique_email() -> str:
    return f"test_{uuid.uuid4().hex[:8]}@example.com"


class TestSignup:
    """Signup creates a new user and sets a session cookie."""

    def test_signup_success(self, client: TestClient) -> None:
        email = _unique_email()
        response = client.post(SIGNUP_URL, json={"name": "Test User", "email": email, "password": "testpass123"})
        assert response.status_code == 201
        body = response.json()
        assert body["success"] is True
        assert body["data"]["email"] == email
        assert body["data"]["role"] == "student"
        assert "id" in body["data"]
        assert "hashed_password" not in body["data"]
        assert "ascendia_session" in response.cookies

    def test_signup_duplicate_email(self, client: TestClient) -> None:
        email = _unique_email()
        client.post(SIGNUP_URL, json={"name": "A", "email": email, "password": "password123"})
        response = client.post(SIGNUP_URL, json={"name": "B", "email": email, "password": "password123"})
        assert response.status_code == 409
        body = response.json()
        assert body["success"] is False

    def test_signup_short_password(self, client: TestClient) -> None:
        response = client.post(SIGNUP_URL, json={"name": "A", "email": _unique_email(), "password": "short"})
        assert response.status_code == 422

    def test_signup_invalid_email(self, client: TestClient) -> None:
        response = client.post(SIGNUP_URL, json={"name": "A", "email": "notanemail", "password": "password123"})
        assert response.status_code == 422

    def test_signup_short_name(self, client: TestClient) -> None:
        response = client.post(SIGNUP_URL, json={"name": "A", "email": _unique_email(), "password": "password123"})
        assert response.status_code == 422


class TestLogin:
    """Login returns a session cookie on success, 401 on failure."""

    def test_login_success(self, client: TestClient) -> None:
        email = _unique_email()
        client.post(SIGNUP_URL, json={"name": "Login Test", "email": email, "password": "loginpass123"})
        response = client.post(LOGIN_URL, json={"email": email, "password": "loginpass123"})
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert "ascendia_session" in response.cookies

    def test_login_wrong_password(self, client: TestClient) -> None:
        email = _unique_email()
        client.post(SIGNUP_URL, json={"name": "User", "email": email, "password": "correctpassword"})
        response = client.post(LOGIN_URL, json={"email": email, "password": "wrongpassword"})
        assert response.status_code == 401
        assert response.json()["success"] is False

    def test_login_unknown_email(self, client: TestClient) -> None:
        response = client.post(LOGIN_URL, json={"email": _unique_email(), "password": "anypassword"})
        assert response.status_code == 401

    def test_login_does_not_reveal_email_existence(self, client: TestClient) -> None:
        """The error message must be the same regardless of whether email exists."""
        r1 = client.post(LOGIN_URL, json={"email": _unique_email(), "password": "wrong"})
        email = _unique_email()
        client.post(SIGNUP_URL, json={"name": "User", "email": email, "password": "pass1234"})
        r2 = client.post(LOGIN_URL, json={"email": email, "password": "wrongpass"})
        assert r1.json()["error"]["message"] == r2.json()["error"]["message"]


class TestLogout:
    """Logout clears the session cookie."""

    def test_logout_clears_cookie(self, client: TestClient) -> None:
        email = _unique_email()
        client.post(SIGNUP_URL, json={"name": "Logout User", "email": email, "password": "logoutpass"})
        client.post(LOGIN_URL, json={"email": email, "password": "logoutpass"})
        response = client.post(LOGOUT_URL)
        assert response.status_code == 200
        assert response.json()["success"] is True


class TestMe:
    """GET /me returns user when authenticated, null when not."""

    def test_me_unauthenticated(self, client: TestClient) -> None:
        # Use a fresh client to avoid inherited cookies
        from app.main import app
        from fastapi.testclient import TestClient as TC
        fresh = TC(app)
        response = fresh.get(ME_URL)
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["data"] is None

    def test_me_authenticated(self, client: TestClient) -> None:
        email = _unique_email()
        client.post(SIGNUP_URL, json={"name": "Me Test", "email": email, "password": "metest123"})
        client.post(LOGIN_URL, json={"email": email, "password": "metest123"})
        response = client.get(ME_URL)
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["data"]["email"] == email
