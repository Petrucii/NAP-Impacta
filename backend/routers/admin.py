"""Rotas admin — todas protegidas por JWT (require_admin)."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, Response, status

from backend.dependencies import DB, CurrentAdmin
from backend.models import (
    ContactMessage,
    FaqItem,
    PageView,
    Post,
    Service,
    TeamMember,
)
from backend.schemas import (
    AdminSummary,
    AdminTotals,
    ContactMessageList,
    ContactMessageRead,
    FaqItemCreate,
    FaqItemRead,
    FaqItemUpdate,
    HandleMessage,
    PostCreate,
    PostRead,
    PostUpdate,
    ServiceCreate,
    ServiceRead,
    ServiceUpdate,
    TeamMemberCreate,
    TeamMemberRead,
    TeamMemberUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ---------- Summary ----------
@router.get("/summary", response_model=AdminSummary)
def summary(db: DB, _: CurrentAdmin) -> AdminSummary:
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    totals = AdminTotals(
        services=db.query(Service).filter(Service.archived_at.is_(None)).count(),
        posts=db.query(Post).filter(Post.archived_at.is_(None)).count(),
        messages_unhandled=db.query(ContactMessage)
        .filter(ContactMessage.handled_at.is_(None))
        .count(),
        views_last_7d=db.query(PageView).filter(PageView.ts >= week_ago).count(),
    )
    return AdminSummary(totals=totals)


# ---------- Services CRUD ----------
@router.get("/services", response_model=list[ServiceRead])
def admin_list_services(db: DB, _: CurrentAdmin) -> list[ServiceRead]:
    rows = db.query(Service).order_by(Service.order_index.asc()).all()
    return [ServiceRead.model_validate(s) for s in rows]


@router.post("/services", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
def admin_create_service(payload: ServiceCreate, db: DB, _: CurrentAdmin) -> ServiceRead:
    if db.query(Service).filter(Service.slug == payload.slug).first():
        raise HTTPException(
            status_code=400,
            detail={"code": "slug_taken", "message": "Slug já existe"},
        )
    svc = Service(**payload.model_dump())
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return ServiceRead.model_validate(svc)


@router.patch("/services/{service_id}", response_model=ServiceRead)
def admin_update_service(
    service_id: str, payload: ServiceUpdate, db: DB, _: CurrentAdmin
) -> ServiceRead:
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "Serviço não encontrado"})
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(svc, k, v)
    db.commit()
    db.refresh(svc)
    return ServiceRead.model_validate(svc)


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_service(service_id: str, db: DB, _: CurrentAdmin) -> Response:
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "Serviço não encontrado"})
    svc.archived_at = datetime.now(timezone.utc)
    svc.published = False
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- Posts CRUD ----------
@router.get("/posts", response_model=list[PostRead])
def admin_list_posts(db: DB, _: CurrentAdmin) -> list[PostRead]:
    rows = db.query(Post).order_by(Post.created_at.desc()).all()
    return [PostRead.model_validate(p) for p in rows]


@router.post("/posts", response_model=PostRead, status_code=status.HTTP_201_CREATED)
def admin_create_post(payload: PostCreate, db: DB, _: CurrentAdmin) -> PostRead:
    if db.query(Post).filter(Post.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail={"code": "slug_taken", "message": "Slug já existe"})
    post = Post(**payload.model_dump(), published_at=datetime.now(timezone.utc))
    db.add(post)
    db.commit()
    db.refresh(post)
    return PostRead.model_validate(post)


@router.patch("/posts/{post_id}", response_model=PostRead)
def admin_update_post(post_id: str, payload: PostUpdate, db: DB, _: CurrentAdmin) -> PostRead:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "Conteúdo não encontrado"})
    data = payload.model_dump(exclude_unset=True)
    publish = data.pop("publish", None)
    for k, v in data.items():
        setattr(post, k, v)
    if publish is True:
        post.published_at = datetime.now(timezone.utc)
    elif publish is False:
        post.published_at = None
    db.commit()
    db.refresh(post)
    return PostRead.model_validate(post)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_post(post_id: str, db: DB, _: CurrentAdmin) -> Response:
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "Conteúdo não encontrado"})
    post.archived_at = datetime.now(timezone.utc)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- FAQ CRUD ----------
@router.get("/faq", response_model=list[FaqItemRead])
def admin_list_faq(db: DB, _: CurrentAdmin) -> list[FaqItemRead]:
    rows = db.query(FaqItem).order_by(FaqItem.order_index.asc()).all()
    return [FaqItemRead.model_validate(f) for f in rows]


@router.post("/faq", response_model=FaqItemRead, status_code=status.HTTP_201_CREATED)
def admin_create_faq(payload: FaqItemCreate, db: DB, _: CurrentAdmin) -> FaqItemRead:
    item = FaqItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return FaqItemRead.model_validate(item)


@router.patch("/faq/{item_id}", response_model=FaqItemRead)
def admin_update_faq(item_id: str, payload: FaqItemUpdate, db: DB, _: CurrentAdmin) -> FaqItemRead:
    item = db.query(FaqItem).filter(FaqItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "FAQ não encontrado"})
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return FaqItemRead.model_validate(item)


@router.delete("/faq/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_faq(item_id: str, db: DB, _: CurrentAdmin) -> Response:
    item = db.query(FaqItem).filter(FaqItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "FAQ não encontrado"})
    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- Team CRUD ----------
@router.get("/team", response_model=list[TeamMemberRead])
def admin_list_team(db: DB, _: CurrentAdmin) -> list[TeamMemberRead]:
    rows = db.query(TeamMember).order_by(TeamMember.order_index.asc()).all()
    return [TeamMemberRead.model_validate(m) for m in rows]


@router.post("/team", response_model=TeamMemberRead, status_code=status.HTTP_201_CREATED)
def admin_create_team(payload: TeamMemberCreate, db: DB, _: CurrentAdmin) -> TeamMemberRead:
    m = TeamMember(**payload.model_dump())
    db.add(m)
    db.commit()
    db.refresh(m)
    return TeamMemberRead.model_validate(m)


@router.patch("/team/{member_id}", response_model=TeamMemberRead)
def admin_update_team(
    member_id: str, payload: TeamMemberUpdate, db: DB, _: CurrentAdmin
) -> TeamMemberRead:
    m = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not m:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "Membro não encontrado"})
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(m, k, v)
    db.commit()
    db.refresh(m)
    return TeamMemberRead.model_validate(m)


@router.delete("/team/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_team(member_id: str, db: DB, _: CurrentAdmin) -> Response:
    m = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not m:
        raise HTTPException(status_code=404, detail={"code": "not_found", "message": "Membro não encontrado"})
    db.delete(m)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------- Mensagens / Inbox ----------
@router.get("/messages", response_model=ContactMessageList)
def admin_list_messages(
    db: DB,
    user: CurrentAdmin,
    handled: bool | None = None,
    limit: int = 20,
    offset: int = 0,
) -> ContactMessageList:
    q = db.query(ContactMessage)
    if handled is True:
        q = q.filter(ContactMessage.handled_at.isnot(None))
    elif handled is False:
        q = q.filter(ContactMessage.handled_at.is_(None))
    total = q.count()
    items = q.order_by(ContactMessage.created_at.desc()).offset(offset).limit(limit).all()
    page = (offset // limit) + 1 if limit else 1
    return ContactMessageList(
        items=[ContactMessageRead.model_validate(m) for m in items],
        total=total,
        page=page,
        page_size=limit,
    )


@router.patch("/messages/{message_id}", response_model=ContactMessageRead)
def admin_handle_message(
    message_id: str, payload: HandleMessage, db: DB, user: CurrentAdmin
) -> ContactMessageRead:
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(
            status_code=404, detail={"code": "not_found", "message": "Mensagem não encontrada"}
        )
    if payload.handled:
        msg.handled_at = datetime.now(timezone.utc)
        msg.handled_by_id = user.id
    else:
        msg.handled_at = None
        msg.handled_by_id = None
    db.commit()
    db.refresh(msg)
    return ContactMessageRead.model_validate(msg)
