from typing import List

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Body sent by frontend `sendMessage()` in src/api/chat.js."""

    message: str
    mode: str = "normal"


class Source(BaseModel):
    id: str
    content: str
    isPoisoned: bool = Field(default=False)
    score: float


class ChatResponse(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    sources: List[Source] = Field(default_factory=list)
