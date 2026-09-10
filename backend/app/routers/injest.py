from fastapi import APIRouter, HTTPException

from app.services.injetion_service import ingest_documents


router = APIRouter(prefix="/api", tags=["injection"])


@router.post("/inject")
def inject():

    try:
        result = ingest_documents()

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print(f"[INJECTION ERROR] {exc}")

        raise HTTPException(
            status_code=500,
            detail="Failed to ingest documents.",
        )