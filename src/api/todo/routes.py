from datetime import datetime
from http import HTTPStatus
from typing import List, Optional
from urllib.parse import urljoin

from beanie import PydanticObjectId
from fastapi import HTTPException, Response
from starlette.requests import Request

import openai
from .app import app
from .models import (Query, QueryAiResponseBlock, Framework, UserFramework)
from .app import settings
openai.api_key = settings.OPENAI_API_KEY

@app.post("/query-ai", response_model=List[QueryAiResponseBlock], response_model_by_alias=False, status_code=201)
async def query_ai(query: Query) -> List[QueryAiResponseBlock]:
    prompt_format = """
    this prompt is to describe how i want to format your response. i will prompt with something like a book title and i want you to respond with the following format
    '
    concept 1
    concept 1 content
    concept 2
    concept 2 content
    '
    make sure you do not return an intro paragraph, conclusion paragraph or anything that deviates from the above format. here is the prompt: return the key frameworks/ideas in
    """
    response = openai.ChatCompletion.create(
        model='gpt-4',
        messages=[
            {
                "role": "system",
                "content": prompt_format + query.userTxt,
            }
        ]
    )
    # Split response into blocks
    response_blocks = response.choices[0].message.content.strip().split("\n\n")

    # Create QueryAiResponseBlock list
    query_ai_response_blocks = []
    for block in response_blocks:
        title, content = block.split("\n", 1)
        query_ai_response_blocks.append(QueryAiResponseBlock(title=title, content=content))
    formatted_blocks = [f"Title: {block.title}\nContent: {block.content}" for block in query_ai_response_blocks]
    print("query_ai response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return query_ai_response_blocks

@app.post("/save-frameworks", response_model=List[UserFramework], status_code=201)
async def save_frameworks(request: Request, saveFrameworks: List[Framework]) -> List[UserFramework]:
    print("saving frameworks")
    print(request.headers)
    user_id = request.headers.get("X-MS-CLIENT-PRINCIPAL-ID")
    results = []
    for framework in saveFrameworks:
        print(f"framework: {framework}")
        results.append(await UserFramework(userid=user_id, title=framework.title, content=framework.content).save())
    return results
