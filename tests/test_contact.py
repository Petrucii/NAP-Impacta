from backend.models import ContactMessage


def test_contact_submit(client, db_session):
    r = client.post(
        "/api/contact",
        json={
            "name": "Fulano",
            "email": "fulano@exemplo.com",
            "topic": "Dúvida",
            "message": "Mensagem longa o suficiente aqui.",
            "isAnonymous": False,
        },
    )
    assert r.status_code == 201
    body = r.json()
    assert body["id"]
    assert body["receivedAt"]
    saved = db_session.query(ContactMessage).first()
    assert saved is not None
    assert saved.email == "fulano@exemplo.com"


def test_contact_validation(client):
    r = client.post(
        "/api/contact",
        json={
            "name": "F",
            "email": "nao-eh-email",
            "topic": "x",
            "message": "curta",
            "isAnonymous": False,
        },
    )
    assert r.status_code == 422


def test_contact_honeypot(client):
    r = client.post(
        "/api/contact",
        json={
            "name": "Bot",
            "email": "bot@exemplo.com",
            "topic": "spam",
            "message": "mensagem com honeypot preenchido",
            "isAnonymous": False,
            "website": "http://spam.com",
        },
    )
    # bot recebe 201 (silencioso) sem persistir — endpoint retorna via HTTPException
    assert r.status_code == 201
