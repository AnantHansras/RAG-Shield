from langchain_core.documents import Document

from app.rag.vectorstore import get_vectorstore


def inject_poisoned_documents(
    doc,
):


    documents = [
        Document(
            page_content=doc.content,
            metadata={
                "id": doc.id,
                "name": doc.title,
                "title": doc.title,
                "isPoisoned": True,
                "attack_type": "broken_bags",
            },
        ),
    ]

    ids = [
        doc.id,
    ]

    vectorstore = get_vectorstore()
    vectorstore.add_documents(
        documents=documents,
        ids=ids,
    )

    return {
        "doc_id": doc.id,
    }