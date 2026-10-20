"""Equipe NAP — leitura pública."""

from fastapi import APIRouter

from backend.dependencies import DB
from backend.models import TeamMember
from backend.schemas import TeamMemberRead

router = APIRouter(prefix="/team", tags=["team"])


@router.get("", response_model=list[TeamMemberRead])
def list_team(db: DB) -> list[TeamMemberRead]:
    members = db.query(TeamMember).order_by(TeamMember.order_index.asc()).all()
    return [TeamMemberRead.model_validate(m) for m in members]
