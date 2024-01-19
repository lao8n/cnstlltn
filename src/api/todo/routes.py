from datetime import datetime
from http import HTTPStatus
from typing import List, Optional
from urllib.parse import urljoin

from beanie import PydanticObjectId
from fastapi import HTTPException, Response
from starlette.requests import Request

from openai import OpenAI
from .app import app
from .models import (Query, QueryAiResponseBlock, Framework, UserFramework, Cluster, UserCluster, LoginConfig)
from .app import settings
from random import uniform
from math import sqrt
from .app import environment

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

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
    response = client.chat.completions.create(
        model='gpt-4',
        messages=[
            {
                "role": "system",
                "content": prompt_format,
            },
            {
                "role": "user",
                "content": query.userTxt,
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
    user_id = request.headers.get("user-id")
    results = []
    for framework in saveFrameworks:
        print(f"framework: {framework}")
        results.append(await UserFramework(userid=user_id, title=framework.title, content=framework.content).save())
    return results

@app.get("/get-constellation", response_model=List[UserFramework], status_code=200)
async def get_constellation(request: Request) -> List[UserFramework]:
    print("getting constellation")
    print(request.headers)
    user_id = request.headers.get("user-id")
    constellation : List[UserFramework] =  await UserFramework.find_many({"userid": user_id}).to_list();
    return constellation

@app.get("/get-cluster", response_model=List[Cluster], status_code=200)
async def get_cluster(request: Request) -> List[Cluster]:
    print("getting cluster")
    print(request.headers)
    user_id = request.headers.get("user-id")
    cluster: List[Cluster] = await UserCluster.find_many({"userid": user_id}).map(lambda x: Cluster(cluster=x.cluster, coordinate=x.coordinate)).to_list();
    print(cluster)
    return cluster

@app.post("/cluster", response_model=List[UserFramework], status_code=200)
async def cluster(request: Request, clusterby: str) ->  List[UserFramework]: 
    user_id = request.headers.get("user-id")
    user_data = await UserFramework.find_many({"userid": user_id}).to_list();
    print(user_data)
    len_user_data = len(user_data)
    prompt_format = f"""
    this prompt is to describe how i want to format your response. i will prompt with something like a list of concepts
    with a title and description separated by a colon, for example 
    concept 1: description of concept 1
    concept 2: description of concept 2
    concept 3: description of concept 3
    i then want you to return the following format where you have a list of categories etc
    category 1
    category 2
    category 1
    this should correspond in order exactly to the list of concepts in the prompt. therefore there should be 
    {len_user_data} lines in total, one for each concept.
    """
    content = f"""the following is a list of concepts and their descriptions, using {clusterby} assign a category to 
    each one of them\n
    """
    for data in user_data: 
        content += f"{data.title}: {data.content}\n"
    response = client.chat.completions.create(
        model='gpt-4',
        messages=[
            {
                "role": "system",
                "content": prompt_format,
            },
            {
                "role": "user",
                "content": content,
            }
        ]
    )
    # Split response into blocks
    response_blocks = response.choices[0].message.content.strip().split("\n")
    print("response blocks")
    print(response_blocks)

    if len(response_blocks) != len(user_data):
        print("response blocks length does not match user data length", len(response_blocks), len(user_data))

    # generate clusters
    clusters = {}
    for i in range (len(response_blocks)):
        if response_blocks[i] not in clusters:
            clusters[response_blocks[i]] = (uniform(0.1, 0.9), uniform(0.1, 0.9))

    for key in clusters:
        await UserCluster(userid=user_id, cluster=key, coordinate=clusters[key]).save()

    for i in range (len(user_data)):
        # if we have n clusters then we want them to have a maximum size of n
        if i < len(response_blocks):
            x = clusters[response_blocks[i]][0] + uniform(-1, 1) / len(clusters)
            y = clusters[response_blocks[i]][1] + uniform(-1, 1) / len(clusters)
            user_data[i].clusterby[clusterby] = Cluster(cluster=response_blocks[i], coordinate=(x, y))
            print(user_data[i], i)
            await user_data[i].save()

    return user_data

@app.get("/login-config", response_model=LoginConfig, status_code=200)
def get_login_config() -> LoginConfig:
    return LoginConfig(googleClientId=settings.GOOGLE_LOGIN_CLIENT_ID)