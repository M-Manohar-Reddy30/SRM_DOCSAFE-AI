import logging

from groq import Groq

from app.core.config import settings
from app.services.retrieval_service import RetrievalService

logger = logging.getLogger(__name__)

client = Groq(
    api_key=settings.GROQ_API_KEY
)


class RAGService:

    @staticmethod
    def generate_chat_response(
        query: str,
        user_id: str,
        document_ids: list[str] = None
    ):

        retrieved_chunks = (
            RetrievalService.semantic_search(
                query=query,
                user_id=user_id,
                top_k=6,
                document_ids=document_ids
            )
        )

        if not retrieved_chunks:
            return {
                "answer": (
                    "I could not find this information "
                    "in your uploaded documents."
                ),
                "sources": []
            }

        context_blocks = []

        for chunk in retrieved_chunks:

            doc_id = chunk["metadata"]["document_id"]

            chunk_index = (
                chunk["metadata"]["chunk_index"]
            )

            context_blocks.append(
                f"[SOURCE: {doc_id} | "
                f"CHUNK: {chunk_index}]\n"
                f"{chunk['text']}\n"
            )

        context = "\n".join(
            context_blocks
        )

        prompt = f"""
You are an intelligent AI assistant.

Answer ONLY using the provided context.

If the answer is not found in the context,
reply exactly:

I could not find this information in your uploaded documents.

Context:

{context}

Question:

{query}
"""

        try:

            response = (
                client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.2,
                )
            )

            answer = (
                response
                .choices[0]
                .message
                .content
            )

            return {
                "answer": answer,
                "sources": [
                    {
                        "document_id":
                        chunk["metadata"]["document_id"],
                        "chunk_index":
                        chunk["metadata"]["chunk_index"]
                    }
                    for chunk in retrieved_chunks
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