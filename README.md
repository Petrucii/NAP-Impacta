# NAP Impacta

Site institucional do Núcleo de Apoio Psicopedagógico do Centro Universitário Impacta.

Stack: **React 18 + Vite + Tailwind** (front) · **FastAPI + SQLAlchemy** (back) · **Vercel** (deploy).

> Spec técnica completa: ver o doc do projeto. Este README cobre apenas o setup e os comandos.

---

## Setup local

Pré-requisitos: Node 20+, Python 3.11+, pnpm (ou npm).

```bash
# 1. Clone e entre no projeto
git clone <repo> nap-impacta && cd nap-impacta

# 2. Variáveis de ambiente
cp .env.example .env
# edite .env com os valores locais (JWT_SECRET, RESEND_API_KEY opcional, etc)

# 3. Backend
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m backend.seed            # cria DB SQLite + admin inicial

# 4. Rodar API (porta 8000)
uvicorn backend.main:app --reload --port 8000

# 5. Em outro terminal: frontend
cd frontend
npm install
npm run dev                       # porta 5173
```

Admin default: `admin@nap.impacta.edu.br` / `nap-admin-2026` (troque em produção).

## Estrutura

```
nap-impacta/
├── api/index.py          # Entry point Vercel (importa backend/main.py)
├── backend/              # FastAPI
│   ├── main.py           # app factory
│   ├── config.py         # settings via pydantic-settings
│   ├── database.py       # engine + SessionLocal
│   ├── security.py       # bcrypt + JWT
│   ├── dependencies.py   # require_admin, get_db
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic v2 schemas
│   ├── seed.py           # bootstrap de dados
│   ├── routers/          # endpoints por domínio
│   └── services/         # integrações (email via Resend)
├── frontend/             # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/        # rotas públicas + /admin
│   │   ├── components/   # ui, layout, content, forms
│   │   ├── features/     # auth, services, posts, contact
│   │   ├── lib/          # api client, SEO, utils
│   │   └── styles/       # Tailwind + tokens
│   └── vite.config.ts
├── vercel.json           # rewrites + runtime Python
└── requirements.txt
```

## Deploy no Vercel

1. Importe o repo no Vercel.
2. Framework preset: **Other** (o `vercel.json` cuida de tudo).
3. Cadastre as env vars listadas em `.env.example`.
4. Push para `main` dispara deploy em produção; qualquer branch gera preview.

## Comandos úteis

```bash
# Backend
pytest                               # testes
alembic revision --autogenerate -m   # nova migration
alembic upgrade head                 # aplicar migrations

# Frontend
npm run build                        # build de produção
npm run lint                         # ESLint
npm run test                         # Vitest
```

## Divisão de responsabilidades

- **Gustavo** — infra, Home (`/`), dashboard admin (`/admin`), design system (`components/ui`), CI/CD
- **Marcos** — `/sobre`, `/equipe`, autenticação admin, CRUD equipe
- **Ryan** — `/servicos`, `/conteudos` (público + admin)
- **Thiago** — `/contato`, `/faq`, `/feedback`, acessibilidade transversal, analytics, inbox admin
