from typing import List
from urllib.parse import urljoin

from starlette.requests import Request

from openai import OpenAI
from todo.app import app
from todo.models import (UserFramework, UserCluster, Query, QueryAiResponseBlock, Framework, LoginConfig)
from todo.app import settings
from random import uniform
from todo import cluster as cl
client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

@app.post("/query-ai", response_model=List[QueryAiResponseBlock], response_model_by_alias=False, status_code=201)
async def query_ai(query: Query) -> List[QueryAiResponseBlock]:
    print("query-ai")
    print("user text: ", query.userTxt)
    print("source: ", query.source)

    system_prompt = """
    You are an AI assistant tasked with analyzing and summarizing key concepts from given texts. Please follow these instructions:

    1. If source material is provided, read it carefully.
    2. Identify key concepts, ideas, or frameworks mentioned in the text or related to the prompt.
    3. For each key concept, provide a response in the following format:

    Title: [Concept Title]
    Source: [Source of the concept, or "General Knowledge" if no specific source]
    Content: [Detailed explanation of the concept]

    Provide multiple concepts related to the given prompt or source material. Do not include any introduction or conclusion.
    """

    user_prompt = f"Please provide key concepts related to the following prompt:\n\n{query.userTxt}"

    if query.source:
        user_prompt = f"""
        Please analyze the following source material:

        {query.source}

        Now, focusing on the following specific prompt, provide relevant key concepts:

        {query.userTxt}
        """

    response = client.chat.completions.create(
        model='gpt-4o', # best model
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ]
    )

    # Split response into blocks
    response_blocks = response.choices[0].message.content.strip().split("\n\n")

    # Create QueryAiResponseBlock list
    query_ai_response_blocks = []
    for block in response_blocks:
        lines = block.split("\n")
        title = lines[0].replace("Title: ", "")
        source = lines[1].replace("Source: ", "")
        content = "\n".join(lines[2:]).replace("Content: ", "")
        query_ai_response_blocks.append(QueryAiResponseBlock(title=title, source=source, content=content))
    formatted_blocks = [f"Title: {block.title}\nSource: {block.source} Content: {block.content}" for block in query_ai_response_blocks]
    print("query_ai response blocks:\n" + '\n\n'.join(formatted_blocks))    
    return query_ai_response_blocks

@app.post("/save-frameworks", response_model=List[UserFramework], status_code=201)
async def save_frameworks(request: Request, saveFrameworks: List[Framework]) -> List[UserFramework]:
    print("saving frameworks")
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    results = []
    ids = []
    for framework in saveFrameworks:
        userFramework = UserFramework(
            userid=user_id, 
            constellation=constellation_name,
            title=framework.title, 
            content=framework.content
        )        
        results.append(userFramework)
        await userFramework.save()
        ids.append(str(userFramework.id))
    user_cluster = await UserCluster.find_one(
        UserCluster.userid == user_id,
        UserCluster.constellation==constellation_name,
        UserCluster.cluster=="Unclustered",
        UserCluster.islatest==True,
    )
    if user_cluster is None:
        user_cluster = UserCluster(
            userid=user_id,
            constellation=constellation_name,
            clusterby='Unclustered',
            islatest=True,
            cluster="Unclustered",
            coordinate=(uniform(0.1, 0.8), uniform(0.1, 0.8))
        )
    for id in ids:
        x = user_cluster.coordinate[0] + uniform(-1, 1) / 8
        y = user_cluster.coordinate[1] + uniform(-1, 1) / 8
        user_cluster.frameworks[id] = (x, y)
    await user_cluster.save()
    return results

@app.post("/edit-framework", response_model=UserFramework, status_code=200)
async def edit_framework(request: Request, framework: UserFramework) -> UserFramework:
    print("edit_framework: ", framework)
    existing_framework = await UserFramework.get(framework.id)
    if existing_framework is not None:
        existing_framework.title = framework.title
        existing_framework.content = framework.content
        existing_framework.source = framework.source
        existing_framework.tags = framework.tags
        await existing_framework.save()
        return existing_framework

@app.get("/get-constellation", response_model=List[UserFramework], status_code=200)
async def get_constellation(request: Request) -> List[UserFramework]:
    print("getting constellation")
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    constellation : List[UserFramework] =  await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).to_list();
    return constellation

@app.get("/get-clusters", response_model=List[UserCluster], status_code=200)
async def get_clusters(request: Request) -> List[UserCluster]:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by = request.query_params.get("clusterBy")
    latest = request.query_params.get("latest")
    user_clusters = await cl.get_clusters(user_id, constellation_name, cluster_by, latest)
    return user_clusters

@app.get("/get-cluster-by-options", status_code=200)
async def get_cluster_by_options(request: Request) -> List[str]:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    options = await cl.get_cluster_by_options(user_id, constellation_name)
    return options

@app.get("/get-cluster-by-suggestion", status_code=200)
async def get_cluster_by_suggestion(request: Request) -> str:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by_suggestion = await cl.get_cluster_by_suggestion(user_id, constellation_name)
    return cluster_by_suggestion

@app.post("/cluster-by", status_code=200)
async def cluster_by(request: Request): 
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by = request.query_params.get("clusterBy")
    cluster_new_only = request.query_params.get("clusterNewOnly")
    await cl.cluster_by(user_id, constellation_name, cluster_by, cluster_new_only)
    return