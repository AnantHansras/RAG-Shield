import os
import json
import hashlib

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings
from app.rag.vectorstore import get_vectorstore


BATCH_SIZE = 5000


def load_documents():

    documents = []

    dataset_path = os.path.join(
        settings.DOCUMENTS_DIR,
        "NQ-open.train.jsonl",
    )

    if not os.path.exists(settings.DOCUMENTS_DIR):
        raise FileNotFoundError(
            f"Documents directory not found: "
            f"{settings.DOCUMENTS_DIR}"
        )

    if not os.path.isfile(dataset_path):
        raise FileNotFoundError(
            f"NQ dataset not found: "
            f"{dataset_path}"
        )

    with open(
        dataset_path,
        "r",
        encoding="utf-8",
    ) as file:

        for line_number, line in enumerate(file, start=1):
            line = line.strip()

            if not line:
                continue

            try:
                item = json.loads(line)

            except json.JSONDecodeError as exc:
                print(
                    f"[INGESTION WARNING] "
                    f"Invalid JSON on line {line_number}: {exc}"
                )
                continue

            question = item.get("question", "")
            answers = item.get("answer", [])

            if not question:
                continue

            if isinstance(answers, list):
                answer_text = ", ".join(
                    str(answer)
                    for answer in answers
                )
            else:
                answer_text = str(answers)

            content = (
                f"Question: {question}\n"
                f"Answer: {answer_text}"
            )

            document = Document(
                page_content=content,
                metadata={
                    "filename": "NQ-open.train.jsonl",
                    "source": dataset_path,
                    "question": question,
                },
            )

            documents.append(document)

    return documents


def split_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            "",
        ],
    )

    return splitter.split_documents(documents)


def generate_document_id(document):

    source = document.metadata.get(
        "source",
        "unknown",
    )

    content = document.page_content

    raw_id = f"{source}:{content}"

    return hashlib.sha256(
        raw_id.encode("utf-8")
    ).hexdigest()


def prepare_metadata(chunks):

    for index, chunk in enumerate(chunks):

        document_id = generate_document_id(
            chunk
        )

        chunk.metadata["document_id"] = document_id

        chunk.metadata["chunk_id"] = (
            f"{document_id[:12]}-{index}"
        )

    return chunks


def ingest_documents():

    documents = load_documents()

    if not documents:
        return {
            "message": "No NQ documents found.",
            "documents": 0,
            "chunks": 0,
        }

    print(
        f"[INGESTION] Loaded {len(documents)} documents."
    )

    chunks = split_documents(
        documents
    )

    chunks = prepare_metadata(
        chunks
    )

    print(
        f"[INGESTION] Created {len(chunks)} chunks."
    )

    vectorstore = get_vectorstore()

    ids = [
        chunk.metadata["chunk_id"]
        for chunk in chunks
    ]

    total_chunks = len(chunks)

    for start in range(
        0,
        total_chunks,
        BATCH_SIZE,
    ):

        end = min(
            start + BATCH_SIZE,
            total_chunks,
        )

        batch_documents = chunks[start:end]
        batch_ids = ids[start:end]

        print(
            f"[INGESTION] Adding chunks "
            f"{start + 1}-{end} "
            f"of {total_chunks}..."
        )

        vectorstore.add_documents(
            documents=batch_documents,
            ids=batch_ids,
        )

        print(
            f"[INGESTION] Progress: "
            f"{end}/{total_chunks} chunks added."
        )

    print(
        "[INGESTION] All documents successfully ingested."
    )

    return {
        "message": "NQ documents ingested successfully.",
        "documents": len(documents),
        "chunks": len(chunks),
    }
