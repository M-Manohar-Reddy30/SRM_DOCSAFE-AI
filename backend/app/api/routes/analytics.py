from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.ai_features import (
    ChatHistory,
    StudyNote,
    AITag
)

router = APIRouter()


@router.get("/dashboard")
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .all()
    )

    total_documents = len(documents)

    ready_documents = len(
        [d for d in documents if d.status == "ready"]
    )

    processing_documents = len(
        [d for d in documents if d.status == "processing"]
    )

    failed_documents = len(
        [d for d in documents if d.status == "failed"]
    )

    total_storage = sum(
        doc.file_size for doc in documents
    )

    storage_mb = round(
        total_storage / (1024 * 1024),
        2
    )

    total_chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .count()
    )

    total_notes = (
        db.query(StudyNote)
        .join(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    total_tags = (
        db.query(AITag)
        .join(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    category_stats = {}

    categories = (
        db.query(
            Document.category,
            func.count(Document.id)
        )
        .filter(Document.user_id == current_user.id)
        .group_by(Document.category)
        .all()
    )

    for category, count in categories:
        category_stats[
            category or "Uncategorized"
        ] = count

    recent_documents = []

    latest_docs = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.upload_date.desc())
        .limit(5)
        .all()
    )

    for doc in latest_docs:
        recent_documents.append({
            "id": str(doc.id),
            "filename": doc.original_filename,
            "category": doc.category,
            "status": doc.status
        })

    return {
        "total_documents": total_documents,
        "ready_documents": ready_documents,
        "processing_documents": processing_documents,
        "failed_documents": failed_documents,
        "storage_used_mb": storage_mb,
        "total_chats": total_chats,
        "total_notes": total_notes,
        "total_tags": total_tags,
        "documents_by_category": category_stats,
        "recent_documents": recent_documents
    }