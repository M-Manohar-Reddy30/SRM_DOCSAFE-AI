from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
from datetime import datetime

class Document(Base, TimestampMixin):
    __tablename__ = "documents"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_hash = Column(String, index=True, nullable=False) # For duplicate detection
    file_path = Column(String, nullable=False)
    category = Column(String, index=True)
    status = Column(String, default="pending", index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="documents")
    
    # 1-to-1 relationships
    text = relationship("DocumentText", back_populates="document", uselist=False, cascade="all, delete-orphan")
    summary = relationship("DocumentSummary", back_populates="document", uselist=False, cascade="all, delete-orphan")
    
    # 1-to-many relationships
    study_notes = relationship("StudyNote", back_populates="document", cascade="all, delete-orphan")
    tags = relationship("AITag", back_populates="document", cascade="all, delete-orphan")
    deadlines = relationship("Deadline", back_populates="document", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="document", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="document", cascade="all, delete-orphan")
