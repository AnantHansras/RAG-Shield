from fastapi import APIRouter

from app.schemas.evaluate import EvaluateRequest, EvaluateResponse, PerQueryResult

router = APIRouter(prefix="/api", tags=["evaluate"])


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(payload: EvaluateRequest) -> EvaluateResponse:
    """Run a batch of queries against a RAG configuration and report
    aggregate performance metrics.

    TODO: BACKEND LOGIC
    Real implementation should:
      1. Route `payload.mode` to the corresponding RAG/defense pipeline.
      2. Run every query in `payload.queries` through it.
      3. Score each answer (correct/incorrect) against ground truth.
      4. Aggregate into F1 / precision / recall / attack success rate (ASR).

    For now this accepts and validates real input (which may be a large
    batch parsed client-side from an uploaded .txt/.csv) but returns
    static placeholder metrics and marks every query as correct.
    """
    per_query = [
        PerQueryResult(id=f"q{i}", query=query, correct=True)
        for i, query in enumerate(payload.queries)
    ]

    return EvaluateResponse(
        totalQueries=len(payload.queries),
        f1=0.0,
        precision=0.0,
        recall=0.0,
        asr=0.0,
        perQuery=per_query,
    )
