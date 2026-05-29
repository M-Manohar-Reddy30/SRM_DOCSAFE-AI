from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class TimestampSchema(ORMModel):
    created_at: datetime
    updated_at: datetime
