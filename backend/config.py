"""Settings carregadas de env vars (via pydantic-settings)."""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    ENV: Literal["development", "preview", "production"] = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./nap.db"

    # Auth
    JWT_SECRET: str = "troque-este-segredo"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_MIN: int = 480  # 8h

    # Admin seed
    ADMIN_SEED_EMAIL: str = "admin@nap.impacta.edu.br"
    ADMIN_SEED_PASSWORD: str = "nap-admin-2026"
    ADMIN_SEED_NAME: str = "Admin NAP"

    # URLs
    SITE_URL: str = "http://localhost:5173"
    API_BASE_URL: str = "http://localhost:8000"

    # CORS — origins permitidas; vazio em prod porque o front está no mesmo domínio
    CORS_ORIGINS: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://localhost:4173"]
    )

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
