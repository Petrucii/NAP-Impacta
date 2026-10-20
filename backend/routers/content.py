"""Conteúdos institucionais e highlights da Home."""

from datetime import datetime, timezone

from fastapi import APIRouter

from backend.dependencies import DB
from backend.models import Post, Service, SiteContent
from backend.schemas import AboutContent, HomeHighlights, PostRead, ServiceRead

router = APIRouter(prefix="/content", tags=["content"])


DEFAULT_BANNER = (
    "O NAP acolhe, orienta e acompanha estudantes "
    "em questões de aprendizagem, adaptação e acessibilidade."
)
DEFAULT_ABOUT = (
    "## Quem somos\n\n"
    "O Núcleo de Apoio Psicopedagógico (NAP) do Centro Universitário Impacta "
    "oferece suporte à comunidade acadêmica em questões relacionadas a "
    "aprendizagem, adaptação, inclusão e acessibilidade.\n\n"
    "## Missão\n\n"
    "Contribuir para uma trajetória acadêmica mais acolhedora, inclusiva e "
    "informada, com apoio direto e material orientativo.\n\n"
    "## Público atendido\n\n"
    "Estudantes de todos os cursos, docentes e colaboradores da Impacta."
)


@router.get("/home-highlights", response_model=HomeHighlights)
def home_highlights(db: DB) -> HomeHighlights:
    now = datetime.now(timezone.utc)

    services = (
        db.query(Service)
        .filter(Service.published.is_(True), Service.archived_at.is_(None))
        .order_by(Service.order_index.asc())
        .limit(3)
        .all()
    )

    posts = (
        db.query(Post)
        .filter(Post.archived_at.is_(None), Post.published_at.isnot(None))
        .filter(Post.published_at <= now)
        .order_by(Post.published_at.desc())
        .limit(3)
        .all()
    )

    banner = db.query(SiteContent).filter(SiteContent.key == "home-banner").first()

    return HomeHighlights(
        featured_services=[ServiceRead.model_validate(s) for s in services],
        recent_posts=[PostRead.model_validate(p) for p in posts],
        banner_text=banner.body_md if banner else DEFAULT_BANNER,
    )


@router.get("/about", response_model=AboutContent)
def about(db: DB) -> AboutContent:
    content = db.query(SiteContent).filter(SiteContent.key == "about").first()
    if content:
        return AboutContent(title=content.title or "Sobre o NAP", body_md=content.body_md)
    return AboutContent(title="Sobre o NAP", body_md=DEFAULT_ABOUT)
