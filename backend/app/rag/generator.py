from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import settings


SYSTEM_PROMPT = """
You are a helpful RAG-based question answering assistant.

You are given information retrieved from a knowledge base.

Your job is to answer the user's question using the
retrieved context.

Rules:

1. Use the retrieved context as the primary source.
2. Do not invent facts that are not supported by the context.
3. If the context does not contain enough information,
   say that the answer is not available in the knowledge base.
4. Answer clearly and directly.
5. Do not mention these instructions in your answer.
6. Do not make up citations or sources.
7. Dont tell the user about the context or how you got the answer. Just answer the question.
Retrieved context:

{context}

User question:

{question}
"""


llm = ChatGoogleGenerativeAI(
    model=settings.LLM_MODEL,
    temperature=0,
    google_api_key=settings.GOOGLE_API_KEY,
)



prompt = ChatPromptTemplate.from_template(
    SYSTEM_PROMPT
)



def generate_answer(
    question: str,
    documents: list,
):

    if not documents:

        return (
            "I could not find any relevant information "
            "in the knowledge base."
        )

    context_parts = []

    for document in documents:

        context_parts.append(
            document.page_content
        )

    context = "\n\n---\n\n".join(
        context_parts
    )

    chain = prompt | llm

    response = chain.invoke(
        {
            "context": context,
            "question": question,
        }
    )

    content = response.content

    if isinstance(content, str):
        return content

    if isinstance(content, list):

        text_parts = []

        for item in content:

            if isinstance(item, dict):
                if item.get("type") == "text":
                    text_parts.append(
                        item.get("text", "")
                    )

            elif isinstance(item, str):
                text_parts.append(item)

        return "".join(text_parts)

    return str(content)