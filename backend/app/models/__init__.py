from app.db.base import Base
from app.models.user import User
from app.models.document import Document
from app.models.ai_features import DocumentText, DocumentSummary, StudyNote, AITag, Deadline, Quiz, ChatHistory
from app.models.analytics import Analytics

# Exposing all models so Alembic can import them from this file
__all__ = [
    "Base", "User", "Document", "DocumentText", "DocumentSummary", 
    "StudyNote", "AITag", "Deadline", "Quiz", "ChatHistory", "Analytics"
]
