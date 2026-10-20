"""Hash de senha (bcrypt) e JWT HS256."""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from backend.config import get_settings

settings = get_settings()

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(plain: str) -> str:
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _pwd_context.verify(plain, hashed)
    except Exception:
        return False


def create_access_token(sub: str, role: str = "editor") -> tuple[str, int]:
    """Retorna (token, expires_in_seconds)."""
    now = datetime.now(timezone.utc)
    exp_delta = timedelta(minutes=settings.JWT_EXPIRES_MIN)
    exp = now + exp_delta
    payload: dict[str, Any] = {
        "sub": sub,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, int(exp_delta.total_seconds())


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
