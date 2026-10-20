"""Dependencies compartilhadas (DB session, admin guard)."""

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import AdminUser
from backend.security import decode_token


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DB = Annotated[Session, Depends(get_db)]


def require_admin(
    db: DB,
    authorization: str | None = Header(default=None),
) -> AdminUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "missing_token", "message": "Token ausente"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ", 1)[1].strip()
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "invalid_token", "message": "Token inválido ou expirado"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first() if user_id else None
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "user_not_found", "message": "Usuário não encontrado"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


CurrentAdmin = Annotated[AdminUser, Depends(require_admin)]
