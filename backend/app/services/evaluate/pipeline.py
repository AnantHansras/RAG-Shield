from app.services.rag_service import run_rag  # adjust import path to wherever run_rag actually lives


class UnknownModeError(ValueError):
    pass


def run_pipeline(mode: str, query: str) -> str:
    """Runs a single query through the RAG pipeline for the given mode
    and returns just the answer text (source docs are discarded here;
    only the route/scoring layer currently cares about the answer).
    """
    try:
        answer, _retrieved_sources = run_rag(message=query, mode=mode)
    except ValueError as exc:
        # run_rag raises ValueError both for "unknown mode" and for
        # "mode not implemented yet" — both should surface as 400s.
        raise UnknownModeError(str(exc)) from exc

    return answer