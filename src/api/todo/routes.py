from typing import List
from urllib.parse import urljoin

from starlette.requests import Request

from openai import OpenAI
from .app import app
from .models import (Query, QueryAiResponseBlock, Framework, UserFramework, Cluster, UserCluster, LoginConfig)
from .app import settings
from random import uniform
from math import sqrt
import json

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

@app.post("/query-ai", response_model=List[QueryAiResponseBlock], response_model_by_alias=False, status_code=201)
async def query_ai(query: Query) -> List[QueryAiResponseBlock]:
    prompt_format = """
    this prompt is to describe how i want to format your response. i will prompt with something like a book title and i want you to respond with the following format
    '
    concept 1
    content 1
    concept 2
    content 2
    '
    make sure you do not return an intro paragraph, conclusion paragraph or anything that deviates from the above format. here is the prompt: return the key frameworks/ideas in

    as an example if the book title was 'guns germs and steel' the response should be in in the following format:
    Geographic Determinism
    This is a core concept in the book. The author suggests that the environment in which a society develops significantly determines its eventual success or failure. Factors such as climate, available flora and fauna, and geography shape the technologies, social organization, and disease resistance of societies.
    Domestication of Plants and Animals
    Jared Diamond discusses how the ability to domesticate plants and animals gave certain societies significant advantages over others. This allowed them to produce more food and support larger and denser populations. This, in turn, led to social stratification and technological advancements.

    Note how none of the concepts or titles are numbered etc. 
    """
    response = client.chat.completions.create(
        model='gpt-4o', # best model
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
    print("raw response")
    print(response)
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
    constellation_name = request.query_params.get("constellationName")
    results = []
    for framework in saveFrameworks:
        print(f"framework: {framework}")
        results.append(await UserFramework(
            userid=user_id, 
            constellation=constellation_name,
            title=framework.title, 
            content=framework.content
        ).save())
    return results

@app.get("/get-constellation", response_model=List[UserFramework], status_code=200)
async def get_constellation(request: Request) -> List[UserFramework]:
    print("getting constellation")
    print(request.headers)
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    constellation : List[UserFramework] =  await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).to_list();
    return constellation

@app.get("/get-cluster", response_model=List[Cluster], status_code=200)
async def get_cluster(request: Request) -> List[Cluster]:
    print("getting cluster")
    print(request.headers)
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    clusterby = request.query_params.get("clusterby")
    print(constellation_name, clusterby)
    clusters_data = await UserCluster.find(
        UserCluster.userid == user_id,
        UserFramework.constellation == constellation_name,
        UserCluster.clusterby == clusterby
    ).to_list()
    print(clusters_data)
    cluster = [Cluster(cluster=x.cluster, coordinate=x.coordinate) for x in clusters_data]
    print(cluster)
    return cluster

@app.post("/cluster", response_model=List[UserFramework], status_code=200)
async def cluster(request: Request, clusterby: str) ->  List[UserFramework]: 
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    user_data : List[UserFramework] =  await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).to_list();
    print(user_data)
    len_user_data = len(user_data)
    prompt_format = f"""
    this prompt is to describe how i want to format your response. i will prompt with something like a list of concepts
    with a title and content and clusterby json format
    [{{"title": "concept 1", "content": "description of concept 1", "clusterby": ""}}, 
     {{"title": "concept 2", "content": "description of concept 2", "clusterby": ""}}, 
     {{"title": "concept 3", "content": "description of concept 3", "clusterby": ""}}]
    i then want you to return the same data but with the clusterby field filled in with the cluster that the concept belongs to
    in valid json format - dropping the content field
    [{{"title": "concept 1", "clusterby": "cluster 1"}}, 
     {{"title": "concept 2", "clusterby": "cluster 2"}}, 
     {{"title": "concept 3", "clusterby": "cluster 1"}}]
    this should correspond in order exactly to the list of concepts in the prompt. therefore there should be 
    {len_user_data} lines in total, one for each concept.
    the following is a list of concepts and their descriptions, using {clusterby} assign a category to 
    each one of them\n
    """
    clusters = {}
    chunk_size = 10
    for index, chunk in enumerate(chunk_list(user_data, chunk_size)):
        json_data = []
        for data in chunk:
            json_data.append({"title": data.title, "content": data.content, "clusterby": ""})
        json_string = json.dumps(json_data)
        response = client.chat.completions.create(
            model='gpt-4o-mini', # cheapest model
            messages=[
                {
                    "role": "system",
                    "content": prompt_format,
                },
                {
                    "role": "user",
                    "content": json_string,
                }
            ]
        )
        # Split response into blocks
        json_response = response.choices[0].message.content.strip()
        print(json_response)
        response_blocks = json.loads(json_response)
        print("response blocks")
        print(response_blocks)

        # generate clusters
        for response_block in response_blocks:
            cluster = response_block['clusterby'].title()
            if cluster not in clusters:
                clusters[cluster] = (uniform(0.1, 0.9), uniform(0.1, 0.9))

        for j in range (len(response_blocks)):
            i = index * chunk_size + j
            cluster = response_blocks[j]['clusterby'].title()
            x = clusters[cluster][0] + uniform(-1, 1) / 8
            y = clusters[cluster][1] + uniform(-1, 1) / 8
            user_data[i].clusterby[clusterby] = Cluster(cluster=cluster, coordinate=(x, y))
            print(user_data[i], i)
            await user_data[i].save()

    # delete all clusters 
    await UserCluster.find(
        UserCluster.userid == user_id,
        UserCluster.constellation == constellation_name,
        UserCluster.clusterby == clusterby
    ).delete_many()
    print(clusters)
    for key, coordinates in clusters.items():
        print(key, coordinates)
        await UserCluster(
            userid=user_id, 
            constellation=constellation_name, 
            clusterby=clusterby, 
            cluster=key, 
            coordinate=coordinates
        ).save()
    
    return user_data

def chunk_list(data, chunk_size):
    for i in range(0, len(data), chunk_size):
        yield data[i:i + chunk_size]

@app.get("/login-config", response_model=LoginConfig, status_code=200)
def get_login_config() -> LoginConfig:
    return LoginConfig(googleClientId=settings.GOOGLE_LOGIN_CLIENT_ID)