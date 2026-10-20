"""Login admin + /me."""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from backend.dependencies import DB, CurrentAdmin
from backend.models import AdminUser
from backend.schemas import AdminUserRead, LoginRequest, TokenResponse
from backend.security import create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DB) -> TokenResponse:
    user = db.query(AdminUser).filter(AdminUser.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "invalid_credentials", "message": "E-mail ou senha inválidos"},
        )
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    token, exp = create_access_token(sub=user.id, role=user.role)
    return TokenResponse(access_token=token, expires_in=exp)


@router.get("/me", response_model=AdminUserRead)
def me(user: CurrentAdmin) -> AdminUserRead:
    return AdminUserRead.model_validate(user)
