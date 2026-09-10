import os
from dotenv import load_dotenv
load_dotenv()


class Settings:

    GOOGLE_API_KEY = os.getenv(
        "GOOGLE_API_KEY"
    )

    LLM_MODEL = os.getenv(
        "LLM_MODEL"
    )

    EMBEDDING_MODEL = os.getenv(
        "EMBEDDING_MODEL"
    )

    CHROMA_DIR = os.getenv(
        "CHROMA_DIR",
        "./vectorstore",
    )

    DOCUMENTS_DIR = os.getenv(
        "DOCUMENTS_DIR",
        "./data",
    )

settings = Settings()