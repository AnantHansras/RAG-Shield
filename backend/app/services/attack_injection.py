from langchain_core.documents import Document

from app.rag.vectorstore import get_vectorstore


def inject_poisoned_documents(
    a1,
    a2,
):


    documents = [
        Document(
            page_content=a1.content,
            metadata={
                "id": a1.id,
                "name": a1.title,
                "title": a1.title,
                "isPoisoned": True,
                "attack_type": "broken_bags",
            },
        ),
        Document(
            page_content=a2.content,
            metadata={
                "id": a2.id,
                "name": a2.title,
                "title": a2.title,
                "isPoisoned": True,
                "attack_type": "broken_bags",
            },
        ),
    ]

    ids = [
        a1.id,
        a2.id,
    ]

    vectorstore = get_vectorstore()
    vectorstore.add_documents(
        documents=documents,
        ids=ids,
    )

    return {
        "a1_id": a1.id,
        "a2_id": a2.id,
    }