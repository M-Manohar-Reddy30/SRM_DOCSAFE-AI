import chromadb

# =====================================================
# Local Persistent ChromaDB
# =====================================================

chroma_client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = chroma_client.get_or_create_collection(
    name="document_chunks"
)

class EmbeddingService:

    @staticmethod
    def store_document_chunks(
        document_id: str,
        user_id: str,
        category: str,
        chunks: list[str]
    ):

        if not chunks:
            return

        ids = [
            f"{document_id}_chunk_{i}"
            for i in range(len(chunks))
        ]

        metadatas = [
            {
                "document_id": str(document_id),
                "user_id": str(user_id),
                "chunk_index": i,
                "category": category
            }
            for i in range(len(chunks))
        ]

        collection.add(
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )

    @staticmethod
    def delete_document_chunks(document_id: str):

        try:
            results = collection.get()

            ids_to_delete = []

            for idx, metadata in enumerate(results["metadatas"]):
                if metadata.get("document_id") == str(document_id):
                    ids_to_delete.append(results["ids"][idx])

            if ids_to_delete:
                collection.delete(ids=ids_to_delete)

        except Exception as e:
            print(f"Error deleting chunks: {e}")

    @staticmethod
    def get_collection():
        return collection