"""Conteúdos / orientações — endpoints públicos."""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from backend.dependencies import DB
from backend.models import Post
from backend.schemas import PostList, PostRead

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("", response_model=PostList)
def list_posts(
    db: DB,
    category: str | None = None,
    limit: int = 12,
    offset: int = 0,
) -> PostList:
    now = datetime.now(timezone.utc)
    q = (
        db.query(Post)
        .filter(Post.archived_at.is_(None))
        .filter(Post.published_at.isnot(None))
        .filter(Post.published_at <= now)
    )
    if category:
        q = q.filter(Post.category == category)
    total = q.count()
    items = q.order_by(Post.published_at.desc()).offset(offset).limit(limit).all()
    page = (offset // limit) + 1 if limit else 1
    return PostList(
        items=[PostRead.model_validate(p) for p in items],
        total=total,
        page=page,
        page_size=limit,
    )


@router.get("/{slug}", response_model=PostRead)
def get_post(slug: str, db: DB) -> PostRead:
    now = datetime.now(timezone.utc)
    post = (
        db.query(Post)
        .filter(
            Post.slug == slug,
            Post.archived_at.is_(None),
            Post.published_at.isnot(None),
            Post.published_at <= now,
        )
        .first()
    )
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "not_found", "message": "Conteúdo não encontrado"},
        )
    return PostRead.model_validate(post)
