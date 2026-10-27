"""Pydantic v2 schemas — camelCase na serialização, snake_case internamente."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=_to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# ---------- Auth ----------
class LoginRequest(CamelModel):
    email: EmailStr
    password: str = Field(min_length=4)


class TokenResponse(CamelModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int


class AdminUserRead(CamelModel):
    id: str
    email: EmailStr
    name: str
    role: str
    last_login_at: datetime | None = None


# ---------- Service ----------
class ServiceBase(CamelModel):
    slug: str = Field(min_length=2, max_length=120, pattern=r"^[a-z0-9-]+$")
    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(min_length=10, max_length=400)
    body_md: str = ""
    icon: str = "heart-handshake"
    order_index: int = 0
    published: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(CamelModel):
    slug: str | None = None
    title: str | None = None
    summary: str | None = None
    body_md: str | None = None
    icon: str | None = None
    order_index: int | None = None
    published: bool | None = None


class ServiceRead(ServiceBase):
    id: str
    created_at: datetime
    updated_at: datetime


class ServiceList(CamelModel):
    items: list[ServiceRead]
    total: int
    page: int = 1
    page_size: int = 50


# ---------- Post ----------
PostCategory = Literal["orientacao", "educativo", "aviso"]


class PostBase(CamelModel):
    slug: str = Field(min_length=2, max_length=120, pattern=r"^[a-z0-9-]+$")
    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(min_length=10, max_length=400)
    body_md: str = ""
    category: PostCategory = "orientacao"
    cover_url: str | None = None
    author: str = "Equipe NAP"


class PostCreate(PostBase):
    pass


class PostUpdate(CamelModel):
    slug: str | None = None
    title: str | None = None
    summary: str | None = None
    body_md: str | None = None
    category: PostCategory | None = None
    cover_url: str | None = None
    author: str | None = None
    publish: bool | None = None  # True = publica (set published_at), False = unpublish


class PostRead(PostBase):
    id: str
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime


class PostList(CamelModel):
    items: list[PostRead]
    total: int
    page: int = 1
    page_size: int = 12


# ---------- FAQ ----------
class FaqItemBase(CamelModel):
    question: str = Field(min_length=5, max_length=300)
    answer_md: str = Field(min_length=1)
    category: str = "geral"
    order_index: int = 0


class FaqItemCreate(FaqItemBase):
    pass


class FaqItemUpdate(CamelModel):
    question: str | None = None
    answer_md: str | None = None
    category: str | None = None
    order_index: int | None = None


class FaqItemRead(FaqItemBase):
    id: str


# ---------- Team ----------
class TeamMemberBase(CamelModel):
    name: str = Field(min_length=2, max_length=120)
    role_title: str = Field(min_length=2, max_length=120)
    bio: str = ""
    photo_url: str | None = None
    order_index: int = 0


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(CamelModel):
    name: str | None = None
    role_title: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    order_index: int | None = None


class TeamMemberRead(TeamMemberBase):
    id: str


# ---------- Contact ----------
class ContactCreate(CamelModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    topic: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=10, max_length=4000)
    is_anonymous: bool = False
    website: str = ""  # honeypot — deve vir vazio


class ContactReceived(CamelModel):
    id: str
    received_at: datetime


class ContactMessageRead(CamelModel):
    id: str
    name: str
    email: EmailStr
    topic: str
    message: str
    is_anonymous: bool
    handled_at: datetime | None
    created_at: datetime


class ContactMessageList(CamelModel):
    items: list[ContactMessageRead]
    total: int
    page: int = 1
    page_size: int = 20


class HandleMessage(CamelModel):
    handled: bool


# ---------- Feedback ----------
class FeedbackCreate(CamelModel):
    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=1000)
    page_slug: str | None = None


class FeedbackReceived(CamelModel):
    id: str


# ---------- Track ----------
class TrackView(CamelModel):
    route: str = Field(min_length=1, max_length=255)


# ---------- Home / About ----------
class HomeHighlights(CamelModel):
    featured_services: list[ServiceRead]
    recent_posts: list[PostRead]
    banner_text: str


class AboutContent(CamelModel):
    title: str
    body_md: str


# ---------- Admin summary ----------
class AdminTotals(CamelModel):
    services: int
    posts: int
    messages_unhandled: int
    views_last_7d: int


class AdminSummary(CamelModel):
    totals: AdminTotals


# ---------- Erros ----------
class ErrorResponse(CamelModel):
    code: str
    message: str
    details: dict | None = None
