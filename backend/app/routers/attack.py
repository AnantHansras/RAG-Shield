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
    RetrievedDocument, 
) 
 
from app.services.broken_bags import ( 
    generate_poisoned_documents, 
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
    "/inject", 
    response_model=InjectResponse, 
) 
def inject( 
    payload: InjectRequest, 
) -> InjectResponse: 
 
    results = [] 
 
    for record in payload.records: 
 
        inject_poisoned_documents( 
            a1=record.a1, 
            a2=record.a2, 
        ) 
 
        results.append( 
            InjectResultItem( 
                targetQuery=record.targetQuery, 
            ) 
        ) 
 
    return InjectResponse( 
        results=results 
    ) 