"""Feedback público (rating 1-5)."""

from fastapi import APIRouter, Header, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

from backend.dependencies import DB
from backend.models import Feedback
from backend.schemas import FeedbackCreate, FeedbackReceived

router = APIRouter(prefix="/feedback", tags=["feedback"])
limiter = Limiter(key_func=get_remote_address)


@router.post(
    "",
    response_model=FeedbackReceived,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/minute")
def submit_feedback(
    request: Request,
    payload: FeedbackCreate,
    db: DB,
    user_agent: str | None = Header(default=None),
) -> FeedbackReceived:
    fb = Feedback(
        rating=payload.rating,
        comment=(payload.comment or None),
        page_slug=payload.page_slug,
        user_agent=(user_agent or "")[:500],
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return FeedbackReceived(id=fb.id)
