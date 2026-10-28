"""Entry point FastAPI. Importado por api/index.py (Vercel) e uvicorn (dev)."""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi import Limiter

from backend.config import get_settings
from backend.database import init_db
from backend.routers import (
    admin,
    auth,
    contact,
    content,
    faq,
    feedback,
    health,
    posts,
    services,
    team,
    track,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nap")

settings = get_settings()

app = FastAPI(
    title="NAP Impacta API",
    version="0.1.0",
    docs_url=None if settings.is_production else "/api/docs",
    redoc_url=None,
    openapi_url=None if settings.is_production else "/api/openapi.json",
)

# Rate limit global
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    if settings.is_production:
        if settings.JWT_SECRET == "troque-este-segredo" or len(settings.JWT_SECRET) < 32:
            raise RuntimeError("Defina JWT_SECRET (>= 32 caracteres) em produção")
        if settings.ADMIN_SEED_PASSWORD == "nap-admin-2026":
            raise RuntimeError("Defina ADMIN_SEED_PASSWORD em produção")

    # create_all é idempotente: cria só o que falta (sem Alembic no MVP).
    init_db()

    # Primeira subida: sem nenhum admin, popula admin + conteúdos iniciais.
    from backend.database import SessionLocal
    from backend.models import AdminUser

    with SessionLocal() as db:
        has_admin = db.query(AdminUser).first() is not None
    if not has_admin:
        from backend.seed import run as run_seed

        run_seed()
        logger.info("Seed inicial executado")


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "code": "validation_error",
            "message": "Dados inválidos",
            "details": {"errors": exc.errors()},
        },
    )


# Montagem dos routers sob /api
API_PREFIX = "/api"
app.include_router(health.router, prefix=API_PREFIX)
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(content.router, prefix=API_PREFIX)
app.include_router(services.router, prefix=API_PREFIX)
app.include_router(posts.router, prefix=API_PREFIX)
app.include_router(team.router, prefix=API_PREFIX)
app.include_router(faq.router, prefix=API_PREFIX)
app.include_router(contact.router, prefix=API_PREFIX)
app.include_router(feedback.router, prefix=API_PREFIX)
app.include_router(track.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)


@app.get("/")
def root() -> dict:
    return {"name": "NAP Impacta API", "docs": "/api/docs" if not settings.is_production else None}
