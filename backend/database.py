"""Engine SQLAlchemy + SessionLocal."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from backend.config import get_settings

settings = get_settings()

# Para SQLite, precisamos de check_same_thread=False
_connect_args = (
    {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)

engine = create_engine(
    settings.database_url,
    connect_args=_connect_args,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine, autoflush=False, autocommit=False, expire_on_commit=False, future=True
)


class Base(DeclarativeBase):
    """Base class para todos os modelos."""

    pass


def init_db() -> None:
    """Cria todas as tabelas (usar só em dev; prod usa Alembic)."""
    from backend import models  # noqa: F401  (registra as tabelas)

    Base.metadata.create_all(bind=engine)
