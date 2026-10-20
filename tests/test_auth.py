from backend.models import AdminUser
from backend.security import hash_password


def test_login_ok(client, db_session):
    db_session.add(
        AdminUser(
            email="test@nap.impacta.edu.br",
            password_hash=hash_password("segredo-123"),
            name="Tester",
        )
    )
    db_session.commit()

    r = client.post(
        "/api/auth/login",
        json={"email": "test@nap.impacta.edu.br", "password": "segredo-123"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["tokenType"] == "bearer"
    assert body["accessToken"]
    assert body["expiresIn"] > 0


def test_login_fail(client, db_session):
    db_session.add(
        AdminUser(
            email="test@nap.impacta.edu.br",
            password_hash=hash_password("segredo-123"),
            name="Tester",
        )
    )
    db_session.commit()

    r = client.post(
        "/api/auth/login",
        json={"email": "test@nap.impacta.edu.br", "password": "errada"},
    )
    assert r.status_code == 401


def test_me_requires_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401
