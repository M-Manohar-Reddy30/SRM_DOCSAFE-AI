from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.ai_features import ChatHistory
from app.services.rag_service import RAGService
from app.services.search_service import SearchService

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None

class SearchRequest(BaseModel):
    query: str

@router.post("/")
def chat_with_docs(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """RAG Chat endpoint. Supports single document, multi-document, or global knowledge base."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    try:
        response_data = RAGService.generate_chat_response(
            query=request.query, 
            user_id=str(current_user.id), 
            document_ids=request.document_ids
        )
        
        # Save history to Postgres
        chat_log = ChatHistory(
            user_id=current_user.id,
            document_id=request.document_ids[0] if request.document_ids and len(request.document_ids) == 1 else None,
            query=request.query,
            response=response_data['answer']
        )
        db.add(chat_log)
        db.commit()
        
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search")
def semantic_search(request: SearchRequest, current_user: User = Depends(get_current_user)):
    """Global Semantic Search across the user's knowledge base."""
    return SearchService.global_search(request.query, str(current_user.id))

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retrieve user's chat history."""
    logs = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.timestamp.desc()).limit(50).all()
    return logs
