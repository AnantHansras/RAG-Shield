from app.rag.retriever import retrieve_documents
from app.rag.generator import generate_answer


def run_rag(message: str,mode: str):

    if mode == "normal":
        retrieved_sources = retrieve_documents(query=message,k=5,)
        answer = generate_answer(
            question=message,
            documents=[
                item["document"]
                for item in retrieved_sources
            ],
        )

        return answer, retrieved_sources


    if mode == "perplexity":

        raise ValueError(
            "Perplexity defense is not implemented yet."
        )

    if mode == "knowledge-extension":

        raise ValueError(
            "Knowledge Extension defense is not implemented yet."
        )


    if mode == "defense-4":

        raise ValueError(
            "Defense-4 is not implemented yet."
        )


    if mode == "ragshield":

        raise ValueError(
            "RAGShield defense is not implemented yet."
        )

    raise ValueError(
        f"Unknown RAG mode: {mode}"
    )

