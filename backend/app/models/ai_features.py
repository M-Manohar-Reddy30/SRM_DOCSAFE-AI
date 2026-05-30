from sqlalchemy import Column, String, Text, Boolean, ForeignKey, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
from datetime import datetime

class DocumentText(Base, TimestampMixin):
    __tablename__ = "document_texts"
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), unique=True, nullable=False)
    extracted_text = Column(Text, nullable=False)
    ocr_used = Column(Boolean, default=False)
    document = relationship("Document", back_populates="text")

class DocumentSummary(Base, TimestampMixin):
    __tablename__ = "document_summaries"
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), unique=True, nullable=False)
    short_summary = Column(Text)
    detailed_summary = Column(Text)
    bullet_points = Column(JSONB)
    document = relationship("Document", back_populates="summary")

class StudyNote(Base, TimestampMixin):
    __tablename__ = "study_notes"
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    note_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    document = relationship("Document", back_populates="study_notes")

class AITag(Base):
    __tablename__ = "ai_tags"
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    tag_name = Column(String, nullable=False, index=True)
    document = relationship("Document", back_populates="tags")

class Deadline(Base):
    __tablename__ = "deadlines"
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    extracted_date = Column(DateTime, nullable=False)
    confidence_score = Column(Float)
    document = relationship("Document", back_populates="deadlines")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    document_id = Column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    title = Column(
        String,
        nullable=True
    )

    is_pinned = Column(
        Boolean,
        default=False
    )

    query = Column(
        Text,
        nullable=False
    )

    response = Column(
        Text,
        nullable=False
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="chat_histories"
    )

    document = relationship(
        "Document",
        back_populates="chat_histories"
    )