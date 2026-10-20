"""FAQ — leitura pública."""

from fastapi import APIRouter

from backend.dependencies import DB
from backend.models import FaqItem
from backend.schemas import FaqItemRead

router = APIRouter(prefix="/faq", tags=["faq"])


@router.get("", response_model=list[FaqItemRead])
def list_faq(db: DB, category: str | None = None) -> list[FaqItemRead]:
    q = db.query(FaqItem)
    if category:
        q = q.filter(FaqItem.category == category)
    items = q.order_by(FaqItem.category.asc(), FaqItem.order_index.asc()).all()
    return [FaqItemRead.model_validate(i) for i in items]
