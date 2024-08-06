from typing import List
from urllib.parse import urljoin

from starlette.requests import Request

from openai import OpenAI
from api.todo.app import app
from api.todo.models.models import (Query, QueryAiResponseBlock, Framework, LoginConfig)
from api.todo.models import (UserFramework, UserCluster)
from api.todo.app import settings
from random import uniform
from api.todo import cluster as cl

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

@app.post("/query-ai", response_model=List[QueryAiResponseBlock], response_model_by_alias=False, status_code=201)
async def query_ai(query: Query) -> List[QueryAiResponseBlock]:
    prompt_format = """
    this prompt is to describe how i want to format your response. i will prompt with something like a book title or an article and i want you to respond with the following format
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

@app.get("/get-cluster", response_model=List[UserCluster], status_code=200)
async def get_cluster(request: Request) -> List[UserCluster]:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by = request.query_params.get("clusterby")
    latest = request.query_params.get("latest")
    user_clusters = await cl.get_cluster(user_id, constellation_name, cluster_by, latest)
    return user_clusters

@app.get("/get_cluster_by_options", status_code=200)
async def get_cluster_by_options(request: Request) -> List[str]:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    options = await cl.get_cluster_by_options(user_id, constellation_name)
    return options

@app.get("/get-cluster-by-suggestion", status_code=200)
async def get_cluster_by_suggestion(request: Request) -> str:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by_suggestion = await cl.get_cluster_by_suggestions(user_id, constellation_name)
    return cluster_by_suggestion

@app.post("/cluster-by", status_code=200)
async def cluster_by(request: Request): 
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by = request.query_params.get("clusterby")
    cluster_new_only = request.query_params.get("clusterNewOnly")
    cl.cluster_by(user_id, constellation_name, cluster_by, cluster_new_only)

@app.get("/login-config", response_model=LoginConfig, status_code=200)
def get_login_config() -> LoginConfig:
    return LoginConfig(googleClientId=settings.GOOGLE_LOGIN_CLIENT_ID)