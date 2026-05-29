from app.services.embedding_service import collection


class RetrievalService:

    @staticmethod
    def semantic_search(
        query: str,
        user_id: str,
        top_k: int = 5,
        document_ids: list[str] = None
    ):

        if document_ids and len(document_ids) > 0:

            where_filter = {
                "$and": [
                    {"user_id": str(user_id)},
                    {"document_id": str(document_ids[0])}
                ]
            }

        else:

            where_filter = {
                "user_id": str(user_id)
            }

        results = collection.query(
            query_texts=[query],
            n_results=top_k,
            where=where_filter
        )

        chunks = []

        if (
            results
            and results["documents"]
            and len(results["documents"][0]) > 0
        ):

            for idx in range(len(results["documents"][0])):

                chunks.append(
                    {
                        "text": results["documents"][0][idx],
                        "metadata": results["metadatas"][0][idx],
                        "distance": results["distances"][0][idx]
                    }
                )

        return chunks