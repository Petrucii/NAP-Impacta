"""Fixtures compartilhadas: cliente HTTP + DB SQLite em memória por teste."""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Fixa env antes de qualquer import do app
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET"] = "test-secret-abcdefghijklmnopqrstuvwxyz0123"

from backend.database import Base  # noqa: E402
from backend.dependencies import get_db  # noqa: E402


@pytest.fixture()
def test_engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()


@pytest.fixture()
def db_session(test_engine):
    TestingSessionLocal = sessionmaker(
        bind=test_engine, autoflush=False, autocommit=False
    )
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(test_engine, db_session):
    from backend.main import app

    TestingSessionLocal = sessionmaker(
        bind=test_engine, autoflush=False, autocommit=False
    )

    def _override_get_db():
        s = TestingSessionLocal()
        try:
            yield s
        finally:
            s.close()

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
