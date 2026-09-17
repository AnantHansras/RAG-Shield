from time import time

from fastapi import APIRouter 
from uuid import uuid4 
 
from app.schemas.attack import ( 
    GenerateRequest, 
    GenerateResponse, 
    GeneratedRecord, 
    InjectRequest, 
    InjectResponse, 
    InjectResultItem, 
    PoisonedDocument,
    RefineResponse,
    RefinedDocument,
    RefinedRecord, 
) 
 
from app.services.broken_bags import ( 
    checkResponse,
    generate_poisoned_documents,
    generateA3, 
) 
 
from app.services.attack_injection import ( 
    inject_poisoned_documents, 
) 
 
 
router = APIRouter( 
    prefix="/api/attack", 
    tags=["attack"], 
) 
 
 
@router.post( 
    "/generate", 
    response_model=GenerateResponse, 
) 
def generate( 
    payload: GenerateRequest, 
) -> GenerateResponse: 
 
    results = [] 
 
    for record in payload.records: 
        
        generated = generate_poisoned_documents( 
            question=record.targetQuery, 
            correct_answer=record.correctAnswer, 
            incorrect_answer=record.incorrectAnswer, 
        ) 
 
        a1 = generated["a1"] 
        a2 = generated["a2"] 
        print(f"Generated poisoned documents for query '{record.targetQuery}': a1={a1['title']}, a2={a2['title']}") 
        results.append( 
            GeneratedRecord( 
                targetQuery=record.targetQuery, 
                correctAnswer=record.correctAnswer, 
                incorrectAnswer=record.incorrectAnswer, 
 
                a1=PoisonedDocument( 
                    id=f"poison-a1-{uuid4()}", 
                    title=a1["title"], 
                    content=a1["content"], 
                ), 
 
                a2=PoisonedDocument( 
                    id=f"poison-a2-{uuid4()}", 
                    title=a2["title"], 
                    content=a2["content"], 
                ), 
            ) 
        ) 

    return GenerateResponse( 
        results=results 
    ) 

@router.post(
    "/refine",
    response_model=RefineResponse,
)
def refine(
    payload: GenerateResponse,
) -> RefineResponse:

    results = []

    for record in payload.results:

        decision = checkResponse(record.targetQuery,
            record.a1,
            record.a2,
        )

        if decision == 1:
            document = RefinedDocument(
                id=record.a1.id,
                title="A1",
                content=record.a1.content,
            )

        elif decision == 2:
            document = RefinedDocument(
                id=record.a2.id,
                title="A2",
                content=record.a2.content,
            )

        elif decision == 3:

            a3 = generateA3(
                question=record.targetQuery,
                a1=record.a1,
                a2=record.a2,
            )

            document = RefinedDocument(
                id=a3.id,
                title="A3",
                content=a3,
            )

        else:
            raise ValueError(
                f"Invalid response from checkResponse: {decision}"
            )

        results.append(
            RefinedRecord(
                targetQuery=record.targetQuery,
                correctAnswer=record.correctAnswer,
                incorrectAnswer=record.incorrectAnswer,
                document=document,
            )
        )

    return RefineResponse(results=results)
 
@router.post( 
    "/inject", 
    response_model=InjectResponse, 
) 
def inject( 
    payload: InjectRequest, 
) -> InjectResponse: 
 
    results = [] 
 
    for record in payload.records: 
 
        inject_poisoned_documents( 
            doc=record.document 
        ) 
 
        results.append( 
            InjectResultItem( 
                targetQuery=record.targetQuery, 
            ) 
        ) 
 
    return InjectResponse( 
        results=results 
    )