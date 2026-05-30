from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import create_tables
from app.models.user import User
from app.models.document import Document
from app.models.ai_features import (
    DocumentText,
    DocumentSummary,
    StudyNote,
    AITag,
    Deadline,
    ChatHistory
)
from app.api.routes import (
    auth,
    documents,
    ai,
    chat,
    analytics
)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(documents.router, prefix=f"{settings.API_V1_STR}/documents", tags=["Documents"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Operations"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["RAG Chat"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])

@app.on_event("startup")
def startup():
    create_tables()

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME
    }