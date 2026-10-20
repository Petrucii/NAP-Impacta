"""Bootstrap de dados: admin inicial + conteúdos de exemplo.

Rode:  python -m backend.seed
"""

from datetime import datetime, timezone

from backend.config import get_settings
from backend.database import SessionLocal, init_db
from backend.models import (
    AdminUser,
    FaqItem,
    Post,
    Service,
    SiteContent,
    TeamMember,
)
from backend.security import hash_password

settings = get_settings()


SERVICES_SEED = [
    {
        "slug": "acolhimento-inicial",
        "title": "Acolhimento inicial",
        "summary": "Primeira escuta para orientar o estudante ao melhor caminho de apoio dentro da Impacta.",
        "body_md": "## O que é\n\nUma conversa individual para entender o que você está vivendo e indicar os próximos passos — seja encaminhamento interno, orientação acadêmica ou material educativo.\n\n## Como funciona\n\n- Agendamento pelo formulário de contato.\n- Primeira sessão de ~40 minutos, presencial ou on-line.\n- Totalmente sigiloso.",
        "icon": "heart-handshake",
        "order_index": 1,
    },
    {
        "slug": "apoio-a-aprendizagem",
        "title": "Apoio à aprendizagem",
        "summary": "Estratégias de estudo, organização de rotina e orientações sobre dificuldades em disciplinas específicas.",
        "body_md": "## O que oferecemos\n\n- Técnicas de estudo personalizadas\n- Organização de rotina acadêmica\n- Orientação sobre dificuldades específicas\n- Mediação com docentes quando necessário",
        "icon": "graduation-cap",
        "order_index": 2,
    },
    {
        "slug": "acessibilidade",
        "title": "Acessibilidade e inclusão",
        "summary": "Suporte para estudantes com deficiência, TEA, TDAH e outras condições que demandem adaptações.",
        "body_md": "## Como atuamos\n\n- Avaliação de necessidades educacionais\n- Articulação com professores sobre adaptações razoáveis\n- Apoio na documentação necessária\n- Acompanhamento ao longo do semestre",
        "icon": "accessibility",
        "order_index": 3,
    },
    {
        "slug": "orientacao-vocacional",
        "title": "Orientação vocacional",
        "summary": "Reflexão sobre escolhas de carreira, mudança de curso e dúvidas sobre trajetória profissional.",
        "body_md": "Encontros individuais ou em grupo para apoiar a tomada de decisão sobre a trajetória profissional, mudança de curso e inserção no mercado.",
        "icon": "compass",
        "order_index": 4,
    },
]


POSTS_SEED = [
    {
        "slug": "como-organizar-a-semana-de-provas",
        "title": "Como organizar a semana de provas sem desespero",
        "summary": "Um guia prático de 5 passos para distribuir estudo e descanso quando a semana aperta.",
        "body_md": "## Passo 1 — Liste tudo\n\nAnote todas as provas, horários e matérias cobradas. Ver no papel reduz a ansiedade.\n\n## Passo 2 — Priorize por peso + dificuldade\n\nNem toda prova vale o mesmo. Comece pela mais pesada e menos dominada.\n\n## Passo 3 — Blocos de 50min + pausa de 10min\n\nTécnica Pomodoro adaptada. Previne a fadiga.\n\n## Passo 4 — Durma\n\nSério. Noite mal dormida apaga o que você estudou.\n\n## Passo 5 — Se travar, procure o NAP\n\nUma conversa curta às vezes destrava uma semana inteira.",
        "category": "orientacao",
        "author": "Equipe NAP",
    },
    {
        "slug": "ansiedade-pre-apresentacao",
        "title": "Ansiedade antes de apresentar trabalho: 3 técnicas que ajudam",
        "summary": "Respiração, ensaio e visualização — como funcionam e por que servem.",
        "body_md": "## Respiração 4-7-8\n\nInspire em 4 tempos, segure em 7, expire em 8. Repetir 3 vezes acalma o sistema nervoso autônomo.\n\n## Ensaio real, não mental\n\nFale a apresentação em voz alta pelo menos duas vezes. O cérebro distingue ensaio real de \"imaginar que falou\".\n\n## Visualize o começo, não o fim\n\nImagine só os 30 primeiros segundos: entrar, cumprimentar, dizer o nome. O resto flui.",
        "category": "educativo",
        "author": "Equipe NAP",
    },
    {
        "slug": "retorno-presencial-adaptacao",
        "title": "Retorno presencial: o que a adaptação exige",
        "summary": "Depois de semestres em casa, voltar ao campus mexe com a rotina. Como se recolocar.",
        "body_md": "A transição do remoto para o presencial reorganiza sono, deslocamento e vida social de uma vez. Dê a si mesmo 2–3 semanas de ajuste e procure apoio se o cansaço não ceder.",
        "category": "orientacao",
        "author": "Equipe NAP",
    },
]


FAQ_SEED = [
    {
        "question": "Como marco um atendimento com o NAP?",
        "answer_md": "Pelo formulário em [/contato](/contato), escolhendo \"Agendar atendimento\" como assunto. Retornamos em até 2 dias úteis.",
        "category": "atendimento",
        "order_index": 1,
    },
    {
        "question": "Os atendimentos são sigilosos?",
        "answer_md": "Sim. O que você conversa com a equipe do NAP não é compartilhado com professores, coordenação ou família sem seu consentimento explícito, salvo situações de risco à vida.",
        "category": "atendimento",
        "order_index": 2,
    },
    {
        "question": "Preciso pagar algo?",
        "answer_md": "Não. Todos os serviços do NAP são gratuitos para a comunidade acadêmica da Impacta.",
        "category": "atendimento",
        "order_index": 3,
    },
    {
        "question": "O NAP faz terapia?",
        "answer_md": "Não substituímos acompanhamento psicológico ou psiquiátrico. Oferecemos escuta, orientação e, quando necessário, encaminhamento para serviços especializados.",
        "category": "servicos",
        "order_index": 1,
    },
    {
        "question": "Posso procurar o NAP se não sou aluno?",
        "answer_md": "O atendimento prioriza estudantes, mas docentes e colaboradores também podem buscar orientação relacionada ao convívio acadêmico.",
        "category": "atendimento",
        "order_index": 4,
    },
]


TEAM_SEED = [
    {
        "name": "Coordenação do NAP",
        "role_title": "Coordenação pedagógica",
        "bio": "Equipe responsável pela gestão do núcleo e articulação com os cursos.",
        "order_index": 1,
    },
    {
        "name": "Psicopedagogia",
        "role_title": "Apoio à aprendizagem",
        "bio": "Atendimento individual e orientações sobre estudo, rotina e desempenho acadêmico.",
        "order_index": 2,
    },
    {
        "name": "Acessibilidade",
        "role_title": "Inclusão e adaptação",
        "bio": "Articulação com docentes e equipe pedagógica para adaptações razoáveis.",
        "order_index": 3,
    },
]


def run() -> None:
    init_db()
    db = SessionLocal()
    try:
        # Admin
        existing = db.query(AdminUser).filter(AdminUser.email == settings.ADMIN_SEED_EMAIL.lower()).first()
        if not existing:
            admin = AdminUser(
                email=settings.ADMIN_SEED_EMAIL.lower(),
                password_hash=hash_password(settings.ADMIN_SEED_PASSWORD),
                name=settings.ADMIN_SEED_NAME,
                role="editor",
            )
            db.add(admin)
            print(f"[seed] admin criado: {admin.email}")
        else:
            print(f"[seed] admin já existe: {existing.email}")

        # Services
        for item in SERVICES_SEED:
            if not db.query(Service).filter(Service.slug == item["slug"]).first():
                db.add(Service(**item))
                print(f"[seed] service: {item['slug']}")

        # Posts (publicados)
        for item in POSTS_SEED:
            if not db.query(Post).filter(Post.slug == item["slug"]).first():
                db.add(Post(**item, published_at=datetime.now(timezone.utc)))
                print(f"[seed] post: {item['slug']}")

        # FAQ
        if not db.query(FaqItem).first():
            for f in FAQ_SEED:
                db.add(FaqItem(**f))
            print(f"[seed] faq: {len(FAQ_SEED)} itens")

        # Team
        if not db.query(TeamMember).first():
            for m in TEAM_SEED:
                db.add(TeamMember(**m))
            print(f"[seed] equipe: {len(TEAM_SEED)} membros")

        # Banner home
        if not db.query(SiteContent).filter(SiteContent.key == "home-banner").first():
            db.add(
                SiteContent(
                    key="home-banner",
                    title="Banner da Home",
                    body_md="O NAP está com atendimentos abertos para o semestre. Agende pelo formulário de contato.",
                )
            )

        db.commit()
        print("[seed] concluído")
    finally:
        db.close()


if __name__ == "__main__":
    run()
