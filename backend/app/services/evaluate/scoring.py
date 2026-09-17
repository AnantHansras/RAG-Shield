from dataclasses import dataclass
from difflib import SequenceMatcher
from typing import List


def _normalize(text: str) -> str:
    return " ".join(text.strip().lower().split())


def answers_match(candidate: str, reference: str, threshold: float = 0.85) -> bool:
    """Fuzzy string match. Swap for exact-match, token-F1, or an LLM-judge
    call depending on what your benchmark expects."""
    a, b = _normalize(candidate), _normalize(reference)
    if not a or not b:
        return False
    if a == b:
        return True
    return SequenceMatcher(None, a, b).ratio() >= threshold


@dataclass
class ScoredQuery:
    query: str
    answer: str
    correct: bool


def score_query(query: str, answer: str, correct_answer: str) -> ScoredQuery:
    correct = answers_match(answer, correct_answer)
    return ScoredQuery(query=query, answer=answer, correct=correct)


@dataclass
class AggregateMetrics:
    precision: float
    recall: float
    f1: float


def aggregate(results: List[ScoredQuery]) -> AggregateMetrics:
    """TP = correct answer, FP/FN = incorrect answer (binary correct/incorrect
    per item, so precision == recall == accuracy here). Adjust if your
    definition of positive/negative class differs."""
    tp = sum(1 for r in results if r.correct)
    total = len(results)
    fp = total - tp
    fn = fp

    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) else 0.0

    return AggregateMetrics(precision=precision, recall=recall, f1=f1)