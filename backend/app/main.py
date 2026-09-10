from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import attack, chat, evaluate,injest


app = FastAPI(
    title="RAGShield API",
    description=(
        "Backend for the RAGShield frontend. Every route validates real "
        "input but currently returns static dummy data — see the "
        "'TODO: BACKEND LOGIC' comment in each router for where the real "
        "RAG / poisoning / defense implementation should go."
    ),
    version="0.1.0",
)

# Allow the Vite dev server (and any other local frontend) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(attack.router)
app.include_router(evaluate.router)
app.include_router(injest.router)

@app.get("/")
def root():
    return {"status": "ok", "service": "RAGShield API"}


@app.get("/health")
def health():
    return {"status": "healthy"}
