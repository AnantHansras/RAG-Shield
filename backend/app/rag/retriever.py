from app.rag.vectorstore import get_vectorstore


def retrieve_documents(
    query: str,
    k: int = 5,
):

    vectorstore = get_vectorstore()

    results = vectorstore.similarity_search_with_score(
        query,
        k=k,
    )

    retrieved = []
    for document, score in results:

        retrieved.append(
            {
                "document": document,
                "score": float(score),
            }
        )

    return retrieved