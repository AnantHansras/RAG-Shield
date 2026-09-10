from langchain_chroma import Chroma

from app.config import settings
from app.rag.embeddings import get_embeddings


COLLECTION_NAME = "rag_knowledge_base"

embeddings = get_embeddings()


def get_vectorstore():

    return Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=settings.CHROMA_DIR,
        embedding_function=embeddings,
    )

