import logging
import google.generativeai as genai

from app.core.config import settings
from app.services.retrieval_service import RetrievalService

logger = logging.getLogger(__name__)

genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


class RAGService:

    @staticmethod
    def generate_chat_response(
        query: str,
        user_id: str,
        document_ids: list[str] = None
    ):

        retrieved_chunks = RetrievalService.semantic_search(
            query=query,
            user_id=user_id,
            top_k=6,
            document_ids=document_ids
        )

        if not retrieved_chunks:
            return {
                "answer": "I could not find this information in your uploaded documents.",
                "sources": []
            }

        context_blocks = []

        for c in retrieved_chunks:

            doc_id = c["metadata"]["document_id"]
            idx = c["metadata"]["chunk_index"]

            context_blocks.append(
                f"[SOURCE: {doc_id} | CHUNK: {idx}]\n{c['text']}\n"
            )

        context = "\n".join(context_blocks)

        prompt = f"""
You are an AI assistant.

Use ONLY the information below.

If the answer is not present,
reply exactly:

I could not find this information in your uploaded documents.

Context:

{context}

Question:

{query}
"""

        try:

            response = model.generate_content(
                prompt
            )

            return {
                "answer": response.text,
                "sources": [
                    {
                        "document_id": c["metadata"]["document_id"],
                        "chunk_index": c["metadata"]["chunk_index"]
                    }
                    for c in retrieved_chunks
                ]
            }

        except Exception as e:

            logger.error(
                f"RAG generation failed: {e}"
            )

            return {
                "answer": "RAG generation failed.",
                "sources": []
            }