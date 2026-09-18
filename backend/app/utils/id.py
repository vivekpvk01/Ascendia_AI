"""
Ascendia AI — UUID utilities
"""

import uuid


def generate_upload_id() -> str:
    """Return a new random UUID string for use as an upload identifier."""
    return str(uuid.uuid4())
