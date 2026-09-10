from typing import List, Optional
from pydantic import BaseModel


class AttackRecord(BaseModel):
    targetQuery: str
    correctAnswer: str
    incorrectAnswer: str


class GenerateRequest(BaseModel):
    records: List[AttackRecord]


class PoisonedDocument(BaseModel):
    id: str
    title: str
    content: str


class GeneratedRecord(BaseModel):
    targetQuery: str
    correctAnswer: str
    incorrectAnswer: str
    a1: PoisonedDocument
    a2: PoisonedDocument


class GenerateResponse(BaseModel):
    results: List[GeneratedRecord]


class InjectRecord(BaseModel):
    targetQuery: str
    correctAnswer: Optional[str] = None
    incorrectAnswer: Optional[str] = None
    a1: PoisonedDocument
    a2: PoisonedDocument


class InjectRequest(BaseModel):
    records: List[InjectRecord]


class RetrievedDocument(BaseModel):
    id: str
    name: str
    score: float
    poisoned: bool = False


class InjectResultItem(BaseModel):
    targetQuery: str


class InjectResponse(BaseModel):
    results: List[InjectResultItem]