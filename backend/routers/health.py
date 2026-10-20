"""Health check — usado por UptimeRobot e similar."""

import os

from fastapi import APIRouter

from backend import __version__

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "version": __version__,
        "commit": os.getenv("VERCEL_GIT_COMMIT_SHA", "local"),
    }
