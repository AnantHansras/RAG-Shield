# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# from app.config import settings


# def get_embeddings():

#     return GoogleGenerativeAIEmbeddings(
#         model=settings.EMBEDDING_MODEL,
#         google_api_key=settings.GOOGLE_API_KEY,
#     )

from langchain_huggingface import HuggingFaceEmbeddings

from app.config import settings


def get_embeddings():

    return HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL,
    )