import logging
from datetime import datetime

from app.db.session import SessionLocal
from app.models.ai_features import (
    AITag,
    Deadline,
    DocumentSummary,
    DocumentText,
    StudyNote,
)
from app.models.document import Document
from app.services.ai_service import AIService
from app.services.chunking_service import ChunkingService
from app.services.ocr_service import OCRService

logger = logging.getLogger(__name__)


class ProcessingService:

    @staticmethod
    def process_document_pipeline(document_id: str):

        db = SessionLocal()

        try:

            print(f"\n========== PROCESSING STARTED ==========")
            print(f"DOCUMENT ID: {document_id}")

            doc = (
                db.query(Document)
                .filter(Document.id == document_id)
                .first()
            )

            if not doc:
                print("DOCUMENT NOT FOUND")
                return

            doc.status = "processing"
            db.commit()

            print("STATUS -> PROCESSING")

            # ==================================================
            # STEP 1 OCR
            # ==================================================

            extracted_text, ocr_used = OCRService.extract_document_text(
                doc.file_path,
                doc.file_type
            )

            doc_text = DocumentText(
                document_id=doc.id,
                extracted_text=extracted_text,
                ocr_used=ocr_used
            )

            db.add(doc_text)
            db.commit()

            print("STEP 1 OCR DONE")

            if not extracted_text.strip():
                raise Exception("No text extracted from document.")

            # ==================================================
            # STEP 2 CLASSIFICATION
            # ==================================================

            category = AIService.classify_document(extracted_text)

            doc.category = category
            db.commit()

            print(f"STEP 2 CLASSIFICATION DONE -> {category}")

            # ==================================================
            # STEP 3 SUMMARY
            # ==================================================

            summary_res = AIService.generate_summary(extracted_text)

            if summary_res:

                summary = DocumentSummary(
                    document_id=doc.id,
                    short_summary=summary_res.short_summary,
                    detailed_summary=summary_res.detailed_summary,
                    bullet_points=summary_res.bullet_points
                )

                db.add(summary)
                db.commit()

                print("STEP 3 SUMMARY DONE")

            else:
                print("STEP 3 SUMMARY SKIPPED")

            # ==================================================
            # STEP 4 TAGS
            # ==================================================

            tags = AIService.generate_tags(extracted_text)

            print(f"TAGS FOUND: {len(tags)}")

            for tag in tags:
                db.add(
                    AITag(
                        document_id=doc.id,
                        tag_name=tag
                    )
                )

            db.commit()

            print("STEP 4 TAGS DONE")

            # ==================================================
            # STEP 5 DEADLINES
            # ==================================================

            deadlines = AIService.extract_deadlines(extracted_text)

            print(f"DEADLINES FOUND: {len(deadlines)}")

            for d in deadlines:

                try:

                    dt = datetime.fromisoformat(
                        d.extracted_date.replace(
                            "Z",
                            "+00:00"
                        )
                    )

                    db.add(
                        Deadline(
                            document_id=doc.id,
                            title=d.title,
                            extracted_date=dt,
                            confidence_score=d.confidence_score
                        )
                    )

                except Exception as deadline_error:

                    print(
                        f"INVALID DEADLINE SKIPPED: "
                        f"{deadline_error}"
                    )

            db.commit()

            print("STEP 5 DEADLINES DONE")

            # ==================================================
            # STEP 6 STUDY NOTES
            # ==================================================

            if category in [
                "Notes",
                "Research Paper",
                "Project Report",
                "Unknown"
            ]:

                notes_res = AIService.generate_study_notes(
                    extracted_text
                )

                if notes_res:

                    db.add(
                        StudyNote(
                            document_id=doc.id,
                            note_type="Exam Notes",
                            content=notes_res.exam_notes
                        )
                    )

                    db.add(
                        StudyNote(
                            document_id=doc.id,
                            note_type="Revision",
                            content=notes_res.revision_notes
                        )
                    )

                    db.add(
                        StudyNote(
                            document_id=doc.id,
                            note_type="Key Concepts",
                            content=notes_res.key_concepts
                        )
                    )

                    db.commit()

                    print("STEP 6 NOTES DONE")

            else:

                print(
                    "STEP 6 NOTES SKIPPED "
                    f"(Category = {category})"
                )

            # ==================================================
            # STEP 7 CHUNKING
            # ==================================================

            chunks = ChunkingService.chunk_text(
                extracted_text
            )

            print(
                f"STEP 7 CHUNKING DONE "
                f"({len(chunks)} chunks)"
            )

            # ==================================================
            # STEP 8 EMBEDDING
            # ==================================================

            from app.services.embedding_service import (
                EmbeddingService
            )

            EmbeddingService.store_document_chunks(
                document_id=str(doc.id),
                user_id=str(doc.user_id),
                category=category,
                chunks=chunks
            )

            print("STEP 8 EMBEDDING DONE")

            # ==================================================
            # FINAL STATUS
            # ==================================================

            doc.status = "ready"

            db.commit()

            print("DOCUMENT READY")
            print("STATUS -> READY")

            logger.info(
                f"Document {document_id} "
                f"fully processed and indexed."
            )

            print("========== PROCESSING FINISHED ==========\n")

        except Exception as e:

            db.rollback()

            print("\n========== PROCESSING FAILED ==========")
            print(f"DOCUMENT ID: {document_id}")
            print(f"ERROR: {str(e)}")
            print("=======================================\n")

            logger.exception(
                f"Processing failed for document "
                f"{document_id}"
            )

            try:

                doc = (
                    db.query(Document)
                    .filter(Document.id == document_id)
                    .first()
                )

                if doc:
                    doc.status = "failed"
                    db.commit()

            except Exception:
                pass

        finally:

            db.close()