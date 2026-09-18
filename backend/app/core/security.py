"""
Ascendia AI — Security utilities

Provides:
- Password hashing and verification (bcrypt via passlib)
- Session token creation and verification (itsdangerous signed cookies)

SECURITY NOTES:
- Passwords are never stored in plaintext.
- Session tokens are signed (HMAC-SHA1) using SESSION_SECRET.
- The SESSION_SECRET must be a long, random string kept server-side.
- Cookie is HTTP-only — not accessible from JavaScript.
"""

import logging
from typing import Optional

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from passlib.context import CryptContext

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# ── Password hashing ─────────────────────────────────────────────────────────

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plaintext password with bcrypt. Never store the plain version."""
    return _pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if plain_password matches the stored hash."""
    return _pwd_context.verify(plain_password, hashed_password)


# ── Session tokens ───────────────────────────────────────────────────────────

SESSION_COOKIE_NAME = "ascendia_session"
# Token expires after 7 days (seconds)
SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60


def _get_serializer() -> URLSafeTimedSerializer:
    settings = get_settings()
    return URLSafeTimedSerializer(settings.session_secret, salt="ascendia-session")


def create_session_token(user_id: str) -> str:
    """
    Create a signed session token containing the user_id.
    The token is safe to store in an HTTP-only cookie.
    """
    serializer = _get_serializer()
    return serializer.dumps(user_id)


def decode_session_token(token: str) -> Optional[str]:
    """
    Decode and verify a session token.

    Returns the user_id if valid and not expired.
    Returns None if the token is invalid, tampered with, or expired.
    """
    serializer = _get_serializer()
    try:
        user_id = serializer.loads(token, max_age=SESSION_MAX_AGE_SECONDS)
        return str(user_id)
    except SignatureExpired:
        logger.debug("Session token expired.")
        return None
    except BadSignature:
        logger.warning("Invalid session token detected.")
        return None
