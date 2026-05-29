from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Dict, Any
from .base import TimestampSchema, ORMModel

class DocumentBase(BaseModel):
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    category: Optional[str] = None
    status: str = "pending"

class DocumentCreate(DocumentBase):
    file_hash: str
    file_path: str
    user_id: UUID

class DocumentResponse(DocumentBase, TimestampSchema):
    id: UUID
    user_id: UUID
    upload_date: datetime
