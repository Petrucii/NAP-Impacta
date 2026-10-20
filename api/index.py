"""Vercel Python serverless entry point.

Vercel detecta este arquivo e cria uma função HTTP a partir dele.
Apenas importamos o app FastAPI (definido em backend/main.py) e,
quando necessário, envolvemos com Mangum para compatibilidade total.
"""

import sys
from pathlib import Path

# Adiciona a raiz do projeto ao sys.path para que `backend` seja importável
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from backend.main import app  # noqa: E402

# Vercel aceita um ASGI `app` diretamente; mantemos `handler` por compat.
handler = app
