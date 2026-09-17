from fastapi import APIRouter, HTTPException

from app.schemas.evaluate import EvaluateRequest, EvaluateResponse, PerQueryResult
from app.services.evaluate.pipeline import UnknownModeError, run_pipeline
from app.services.evaluate.scoring import aggregate, score_query

router = APIRouter(prefix="/api", tags=["evaluate"])


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(payload: EvaluateRequest) -> EvaluateResponse:
    """Run a batch of (query, correct_answer) pairs against a RAG
    configuration and report aggregate performance metrics."""
    scored = []
    for item in payload.queries:
        try:
            answer = run_pipeline(payload.mode, item.query)
        except UnknownModeError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        scored.append(score_query(item.query, answer, item.correct_answer))

    metrics = aggregate(scored)

    per_query = [
        PerQueryResult(id=f"q{i}", query=r.query, correct=r.correct)
        for i, r in enumerate(scored)
    ]

    return EvaluateResponse(
        totalQueries=len(scored),
        f1=metrics.f1,
        precision=metrics.precision,
        recall=metrics.recall,
        asr=0.0,  # not computed here — see the separate attack router if ASR belongs there
        perQuery=per_query,
    )