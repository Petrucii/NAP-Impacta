"""Analytics interno — pageview sem cookies."""

import hashlib

from fastapi import APIRouter, Header, Response, status
from starlette.requests import Request

from backend.dependencies import DB
from backend.models import PageView
from backend.schemas import TrackView

router = APIRouter(prefix="/track", tags=["track"])


def _session_hash(ip: str, ua: str) -> str:
    raw = f"{ip}|{ua}".encode()
    return hashlib.sha256(raw).hexdigest()


@router.post("/view", status_code=status.HTTP_204_NO_CONTENT)
def track_view(
    request: Request,
    payload: TrackView,
    db: DB,
    user_agent: str | None = Header(default=None),
) -> Response:
    ip = request.client.host if request.client else "unknown"
    pv = PageView(
        route=payload.route[:255],
        session_hash=_session_hash(ip, user_agent or ""),
    )
    db.add(pv)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
