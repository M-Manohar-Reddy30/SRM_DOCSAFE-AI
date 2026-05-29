import os
import hashlib

from fastapi import UploadFile, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.user import User
from app.services.processing_service import ProcessingService

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg"
]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


class DocumentService:

    @staticmethod
    def calculate_file_hash(content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()

    @staticmethod
    async def upload_document(
        db: Session,
        file: UploadFile,
        current_user: User,
        background_tasks: BackgroundTasks
    ) -> Document:

        # Validate file type
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Supported types: PDF, PNG, JPG, JPEG"
            )

        content = await file.read()

        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB."
            )

        # Calculate file hash
        file_hash = DocumentService.calculate_file_hash(content)

        # Duplicate detection
        existing_doc = (
            db.query(Document)
            .filter(
                Document.file_hash == file_hash,
                Document.user_id == current_user.id
            )
            .first()
        )

        if existing_doc:
            raise HTTPException(
                status_code=409,
                detail="Document already exists in your library."
            )

        # Save file
        file_extension = os.path.splitext(file.filename)[1]
        safe_filename = f"{file_hash}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(file_path, "wb") as f:
            f.write(content)

        # Create document record
        new_doc = Document(
            user_id=current_user.id,
            filename=safe_filename,
            original_filename=file.filename,
            file_type=file.content_type,
            file_size=len(content),
            file_hash=file_hash,
            file_path=file_path,
            category="Uncategorized",
            status="pending"
        )

        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)

        # Launch AI processing
        background_tasks.add_task(
            ProcessingService.process_document_pipeline,
            str(new_doc.id)
        )

        return new_doc

    @staticmethod
    def get_document(
        db: Session,
        document_id: str,
        current_user: User
    ) -> Document:

        doc = (
            db.query(Document)
            .filter(
                Document.id == document_id,
                Document.user_id == current_user.id
            )
            .first()
        )

        if not doc:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        return doc

    @staticmethod
    def delete_document(
        db: Session,
        document_id: str,
        current_user: User
    ):

        doc = DocumentService.get_document(
            db,
            document_id,
            current_user
        )

        # Delete embeddings from ChromaDB
        try:
            from app.services.embedding_service import EmbeddingService

            EmbeddingService.delete_document_chunks(
                str(doc.id)
            )

        except Exception as e:
            print(f"Embedding deletion error: {e}")

        # Delete physical file
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)

        # Delete database record
        db.delete(doc)
        db.commit()

        return {
            "detail": "Document deleted successfully"
        }