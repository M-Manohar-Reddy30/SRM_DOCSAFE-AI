from app.services.retrieval_service import RetrievalService

class SearchService:
    @staticmethod
    def global_search(query: str, user_id: str) -> list[dict]:
        """
        Performs a semantic search across the entire user's knowledge base.
        Useful for "Find me notes about deep learning".
        Returns deduplicated document_ids and the relevant snippets.
        """
        chunks = RetrievalService.semantic_search(query, user_id, top_k=10)
        
        results = []
        seen_docs = set()
        
        for c in chunks:
            doc_id = c['metadata']['document_id']
            if doc_id not in seen_docs:
                seen_docs.add(doc_id)
                results.append({
                    "document_id": doc_id,
                    "snippet": c['text'][:200] + "...",
                    "relevance": c['distance'] # Lower distance = higher relevance
                })
                
        return results
