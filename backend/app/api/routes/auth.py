from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    return AuthService.create_user(db, user_in)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""
    return AuthService.authenticate(db, form_data.username, form_data.password)

@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
