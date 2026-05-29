from app.db.base import Base
from app.db.session import engine

# Import ALL models here
from app.models.user import User

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")