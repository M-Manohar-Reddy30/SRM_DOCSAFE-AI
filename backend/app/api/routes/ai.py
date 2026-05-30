from app.models.ai_features import (
    DocumentSummary,
    StudyNote,
    DocumentText
)

from app.services.ai_service import AIService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.ai_features import (
    DocumentSummary,
    StudyNote
)

router = APIRouter()


@router.get("/{document_id}/summary")
def get_summary(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    summary = (
        db.query(DocumentSummary)
        .filter(
            DocumentSummary.document_id == document.id
        )
        .first()
    )

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Summary not available yet. Document may still be processing."
        )

    return {
        "document_id": str(document.id),
        "short_summary": summary.short_summary,
        "detailed_summary": summary.detailed_summary,
        "bullet_points": summary.bullet_points
    }


@router.get("/{document_id}/notes")
def get_notes(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    notes = (
        db.query(StudyNote)
        .filter(
            StudyNote.document_id == document.id
        )
        .all()
    )

    if not notes:
        raise HTTPException(
            status_code=404,
            detail="Study notes not available."
        )

    return [
        {
            "note_type": note.note_type,
            "content": note.content
        }
        for note in notes
    ]
