from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    BackgroundTasks,
    HTTPException
)

from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter()


@router.post("/upload", response_model=DocumentResponse, status_code=202)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload document and queue AI processing.
    """
    return await DocumentService.upload_document(
        db,
        file,
        current_user,
        background_tasks
    )


@router.get("/", response_model=List[DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all documents.
    """
    return (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .all()
    )


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get document details.
    """
    return DocumentService.get_document(
        db,
        document_id,
        current_user
    )


@router.get("/{document_id}/download")
def download_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Download document.
    """

    doc = DocumentService.get_document(
        db,
        document_id,
        current_user
    )

    return FileResponse(
        path=doc.file_path,
        filename=doc.original_filename,
        media_type=doc.file_type
    )


@router.get("/{document_id}/preview")
def preview_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Preview PDF in browser.
    """

    doc = DocumentService.get_document(
        db,
        document_id,
        current_user
    )

    return FileResponse(
        path=doc.file_path,
        media_type=doc.file_type
    )


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete document.
    """

    return DocumentService.delete_document(
        db,
        document_id,
        current_user
    )