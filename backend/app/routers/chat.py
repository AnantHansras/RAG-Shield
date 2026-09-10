
#     return ChatResponse(
#         id=f"m-{uuid.uuid4().hex[:10]}",
#         role="assistant",
#         content=(
#             "This is a placeholder response from the RAGShield API. "
#             "Real retrieval and generation are not implemented yet."
#         ),
#         sources=[
#             Source(id="doc_01", name="Document 1", path="Knowledge Base / document_01.txt", score=0.91),
#             Source(id="doc_02", name="Document 2", path="Knowledge Base / document_02.txt", score=0.84),
#             Source(id="doc_03", name="Document 3", path="Knowledge Base / document_03.txt", score=0.78),
#         ],
#     )


import uuid

from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse, Source
from app.services.rag_service import run_rag


router = APIRouter(prefix="/api", tags=["chat"])


SUPPORTED_MODES = {
    "normal",
    "perplexity",
    "knowledge-extension",
    "defense-4",
    "ragshield",
}


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:


    message = payload.message.strip()
    mode = payload.mode.strip().lower()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )


    if mode not in SUPPORTED_MODES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported mode '{mode}'. "
                f"Supported modes: {sorted(SUPPORTED_MODES)}"
            ),
        )

    try:
        answer, retrieved_sources = run_rag(
            message=message,
            mode=mode,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print(f"[CHAT ERROR] {exc}")

        raise HTTPException(
            status_code=500,
            detail="Failed to process the chat request.",
        )


    sources = []

    for index, item in enumerate(retrieved_sources):

        document = item["document"]
        score = item["score"]

        metadata = document.metadata or {}

        path = metadata.get(
            "source",
            "Unknown source",
        )

        name = path.replace("\\", "/").split("/")[-1]

        sources.append(
            Source(
                id=str(
                    metadata.get(
                        "document_id"
                    )
                ),
                content=document.page_content,
                score=float(score),
                isPoisoned=document.metadata.get("isPoisoned", False),
            )
        )


    return ChatResponse(
        id=f"m-{uuid.uuid4().hex[:10]}",
        role="assistant",
        content=answer,
        sources=sources,
    )