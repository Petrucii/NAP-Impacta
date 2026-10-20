"""Serviços — endpoints públicos."""

from fastapi import APIRouter, HTTPException, status

from backend.dependencies import DB
from backend.models import Service
from backend.schemas import ServiceList, ServiceRead

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=ServiceList)
def list_services(db: DB, limit: int = 50, offset: int = 0) -> ServiceList:
    q = db.query(Service).filter(
        Service.published.is_(True), Service.archived_at.is_(None)
    )
    total = q.count()
    items = q.order_by(Service.order_index.asc()).offset(offset).limit(limit).all()
    page = (offset // limit) + 1 if limit else 1
    return ServiceList(
        items=[ServiceRead.model_validate(s) for s in items],
        total=total,
        page=page,
        page_size=limit,
    )


@router.get("/{slug}", response_model=ServiceRead)
def get_service(slug: str, db: DB) -> ServiceRead:
    svc = (
        db.query(Service)
        .filter(
            Service.slug == slug,
            Service.published.is_(True),
            Service.archived_at.is_(None),
        )
        .first()
    )
    if not svc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "not_found", "message": "Serviço não encontrado"},
        )
    return ServiceRead.model_validate(svc)
