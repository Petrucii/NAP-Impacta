"""Formulário de contato público."""

from fastapi import APIRouter, HTTPException, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

from backend.dependencies import DB
from backend.models import ContactMessage
from backend.schemas import ContactCreate, ContactReceived
from backend.services.email import send_contact_email

router = APIRouter(prefix="/contact", tags=["contact"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "",
    response_model=ContactReceived,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/minute")
async def submit_contact(request: Request, payload: ContactCreate, db: DB) -> ContactReceived:
    # honeypot: campo "website" deve ser string vazia; bot tende a preencher
    if payload.website:
        # resposta aparentemente de sucesso para não dar sinal ao bot
        raise HTTPException(
            status_code=status.HTTP_201_CREATED,
            detail={"code": "accepted", "message": "ok"},
        )

    name = "Anônimo" if payload.is_anonymous else payload.name.strip()

    msg = ContactMessage(
        name=name,
        email=payload.email.lower(),
        topic=payload.topic.strip(),
        message=payload.message.strip(),
        is_anonymous=payload.is_anonymous,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # dispara e-mail — se falhar, a mensagem já está salva
    sent = await send_contact_email(
        from_name=name,
        from_email=payload.email,
        topic=payload.topic,
        message=payload.message,
        is_anonymous=payload.is_anonymous,
    )
    if sent:
        msg.email_sent = True
        db.commit()

    return ContactReceived(id=msg.id, received_at=msg.created_at)
