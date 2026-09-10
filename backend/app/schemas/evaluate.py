from typing import List

from pydantic import BaseModel


class EvaluateRequest(BaseModel):
    """Body sent by `evaluateSystem()` in src/api/evaluate.js."""

    mode: str
    queries: List[str]


class PerQueryResult(BaseModel):
    id: str
    query: str
    correct: bool


class EvaluateResponse(BaseModel):
    totalQueries: int
    f1: float
    precision: float
    recall: float
    asr: float
    perQuery: List[PerQueryResult]
