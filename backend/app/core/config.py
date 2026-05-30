from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "SRMDOCSAFE AI API"
    VERSION: str = "1.0.0"

    API_V1_STR: str = "/api"

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    GROQ_API_KEY: str = ""

    CHROMA_DB_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"


settings = Settings()