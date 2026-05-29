from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from .base import TimestampSchema

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase, TimestampSchema):
    id: UUID
    role: str
