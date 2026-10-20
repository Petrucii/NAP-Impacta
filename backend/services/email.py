"""Envio de e-mail transacional via Resend.

Em dev sem RESEND_API_KEY, apenas loga no console e retorna False.
"""

import logging

import httpx

from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

RESEND_URL = "https://api.resend.com/emails"


async def send_contact_email(
    *, from_name: str, from_email: str, topic: str, message: str, is_anonymous: bool
) -> bool:
    """Envia o e-mail do formulário de contato para a inbox do NAP.
    Retorna True se o Resend aceitou; False caso contrário.
    """
    if not settings.RESEND_API_KEY:
        logger.info(
            "RESEND_API_KEY vazio — e-mail não enviado. "
            "Em dev isso é esperado. Mensagem salva no DB."
        )
        return False

    author = "Anônimo" if is_anonymous else from_name
    subject = f"[NAP] {topic} — {author}"
    text_body = (
        f"Autor: {author}\n"
        f"E-mail: {from_email}\n"
        f"Assunto: {topic}\n\n"
        f"{message}"
    )

    payload = {
        "from": settings.CONTACT_FROM,
        "to": [settings.CONTACT_INBOX],
        "reply_to": from_email,
        "subject": subject,
        "text": text_body,
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                RESEND_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
            )
        if resp.status_code >= 400:
            logger.warning("Resend falhou: %s %s", resp.status_code, resp.text)
            return False
        return True
    except Exception:
        logger.exception("Erro inesperado chamando Resend")
        return False
