# typing imports
from starlette.requests import Request
from typing import List, Any
from collections import defaultdict
# package imports
import json
from random import uniform
from todo.models import (UserFramework, UserCluster)
# local imports
from todo.app import app, openai_client
from todo.models import (UserFramework, UserCluster)

@app.get("/get-clusters", response_model=List[UserCluster], status_code=200)
async def get_clusters(request: Request) -> List[UserCluster]:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by = request.query_params.get("clusterBy")
    latest = request.query_params.get("latest")
    print("get_clusters params:", user_id, constellation_name, cluster_by, latest)
    user_clusters = []
    if latest:
        user_clusters = await UserCluster.find(
            UserCluster.userid == user_id,
            UserCluster.constellation == constellation_name,
            UserCluster.islatest == True,
        ).to_list()
    else:
        user_clusters = await UserCluster.find(
            UserCluster.userid == user_id,
            UserCluster.constellation == constellation_name,
            UserCluster.clusterby == cluster_by
        ).to_list()
    print("get_clusters returns:", user_clusters)
    return user_clusters

@app.get("/get-cluster-by-options", status_code=200)
async def get_cluster_by_options(request: Request) -> List[str]:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")    
    print("get_cluster_by_options params:", user_id, constellation_name)
    user_clusters = UserCluster.find(
        UserCluster.userid == user_id,
        UserCluster.constellation == constellation_name,
    )
    cluster_options = set()
    async for user_cluster in user_clusters:
        if user_cluster.clusterby != "Cnstlltn Tutorial" and user_cluster.clusterby != "Unclustered":
            cluster_options.add(user_cluster.clusterby)
    cluster_options_list = list(cluster_options)
    print("get_cluster_by_options returns:", cluster_options_list)
    return cluster_options_list

@app.get("/get-cluster-by-suggestion", status_code=200)
async def get_cluster_by_suggestion(request: Request) -> str:
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    print("get_cluster_by_suggestion params:", user_id, constellation_name)
    user_data : List[UserFramework] = await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).to_list()
    prompt_format = f"""
    this prompt is to describe how i want to format your response. i will prompt you with lots of concepts and content
    and i want you to come up with roughly 3-8 categories that could neatly divide them up. 
    you should return these categories as a single comma separated string for example you might suggest below:
    political, economic, sociological, technological, legal, environmental, psychological etc
    you should not return anything else except this single line string\n
    """
    json_data = []
    for data in user_data:
         json_data.append({"title": data.title, "content": data.content})
    json_string = json.dumps(json_data)
    #TODO: handle json_string > max num characters
    response = openai_client.chat.completions.create(
        model='gpt-4o-mini',
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
    content =  response.choices[0].message.content.strip()
    print("get_cluster_by_suggestion returns:", content)
    return content

@app.post("/cluster-by", status_code=200)
async def cluster_by(request: Request): 
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    cluster_by = request.query_params.get("clusterBy")
    cluster_new_only = request.query_params.get("clusterNewOnly")
    print("get_cluster_by params:", user_id, constellation_name, cluster_by, cluster_new_only)
    await _set_not_latest(user_id, constellation_name)
    user_data, clusters, user_clusters = await _data_to_cluster(user_id, constellation_name, cluster_by, cluster_new_only)
    print("data to cluster output:", user_data, clusters, user_clusters)
    prompt_format = f"""
    this prompt is to describe how i want to format your response. i will prompt with something like a list of concepts
    with an id, title and content and clusterby json format
    [{{"id": "id1", "title": "concept 1", "source": "source 1", "content": "description of concept 1", "tags": "tag1, tag2", "clusterby": ""}}, 
     {{"id": "id2", "title": "concept 2", "source": "source 2", "content": "description of concept 2", "tags": "", "clusterby": ""}}, 
     {{"id": "id3", "title": "concept 3", "source": "source 3", "content": "description of concept 3", "tags": "tag2, tag3", "clusterby": ""}}]
    i then want you to return the same data but with the clusterby field filled in with the cluster that the concept belongs to
    in valid json format - dropping the content field
    [{{"id": "id1", "title": "concept 1", "clusterby": "cluster 1"}}, 
     {{"id": "id2", "title": "concept 2", "clusterby": "cluster 2"}}, 
     {{"id": "id3", "title": "concept 3", "clusterby": "cluster 1"}}]
    this should correspond in order exactly to the list of concepts in the prompt. therefore there should be 
    {len(user_data)} lines in total, one for each concept.
    the following is a list of concepts and their descriptions, using {cluster_by} assign a category to 
    each one of them\n
    """
    chunk_size = 10
    new_clusters = {} # cluster -> coordinates
    all_cluster_ids = defaultdict(list) # cluster -> []ids
    for chunk in _chunk_list(user_data, chunk_size):
        json_data = []
        for data in chunk:
            json_data.append({"id": str(data.id), "title": data.title, "source": data.source, "content": data.content, "tags": ", ".join(data.tags), "clusterby": ""})
        json_string = json.dumps(json_data)
        response = openai_client.chat.completions.create(
            model='gpt-4o', # mini doesn't work
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
        json_response = response.choices[0].message.content.strip()
        
        # Add error handling and logging
        try:
            # Remove code block markers if present
            json_response = json_response.strip('`')
            if json_response.startswith('json\n'):
                json_response = json_response[5:]
            
            response_blocks = json.loads(json_response)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print(f"Raw response: {json_response}")
            # You might want to skip this chunk or handle the error differently
            continue

        for response_block in response_blocks:
            id = response_block['id']
            cluster = response_block['clusterby'].title()
            if cluster not in clusters and cluster not in new_clusters:
                new_clusters[cluster] = (uniform(0.1, 0.8), uniform(0.1, 0.8))
            all_cluster_ids[cluster].append(id)
    print("user_clusters:", user_clusters, " clusters ", clusters, " cluster_ids ", all_cluster_ids)
    print("new_clusters", new_clusters)
    await _save_clusters(user_id, constellation_name, cluster_by, user_clusters, clusters, all_cluster_ids, new_clusters)
    return

async def _set_not_latest(user_id: str, constellation_name: str):
    user_clusters = UserCluster.find(
            UserCluster.userid == user_id,
            UserCluster.constellation == constellation_name,
            UserCluster.islatest == True,
        )
    async for user_cluster in user_clusters:
        user_cluster.islatest = False
        await user_cluster.save()
    return

async def _data_to_cluster(user_id: str, constellation_name: str, cluster_by: str, cluster_new_only: bool):
    user_data : List[UserFramework] = await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).to_list()
    clusters = {} # cluster -> coordinate
    user_clusters = []
    # filter out data where we already have a cluster coordinate
    if cluster_new_only:
        user_clusters = await UserCluster.find(
            UserCluster.userid == user_id,
            UserCluster.constellation == constellation_name,
            UserCluster.clusterby == cluster_by,
        ).to_list()
        print("user_clusters", user_clusters)
        framework_keys = set()
        for user_cluster in user_clusters:
            framework_keys.update(user_cluster.frameworks.keys())
            clusters[user_cluster.cluster] = user_cluster.coordinate
        new_user_data = [user_framework for user_framework in user_data if str(user_framework.id) not in framework_keys]
        user_data = new_user_data
    return user_data, clusters, user_clusters

async def _save_clusters(user_id: str, constellation_name: str, cluster_by: str, user_clusters: List[UserCluster], clusters: dict, cluster_ids: defaultdict[Any, list], new_clusters: dict):
    for user_cluster in user_clusters:
        user_cluster.islatest = True
        for id in cluster_ids[user_cluster.cluster]:
            x = clusters[user_cluster.cluster][0] + uniform(-1, 1) / 8
            y = clusters[user_cluster.cluster][1] + uniform(-1, 1) / 8 
            user_cluster.frameworks[id] = (x, y)
        await user_cluster.save()
    
    # New user clusters
    for cluster, coordinate in new_clusters.items():
        user_cluster = UserCluster(
            userid=user_id,
            constellation=constellation_name,
            clusterby=cluster_by,
            islatest=True,
            cluster=cluster,
            coordinate=coordinate,
        )
        for id in cluster_ids[cluster]:
            x = coordinate[0] + uniform(-1, 1) / 8
            y = coordinate[1] + uniform(-1, 1) / 8 
            user_cluster.frameworks[id] = (x, y)
        await user_cluster.save()
    return
    
def _chunk_list(data: List[UserFramework], chunk_size: int):
    for i in range(0, len(data), chunk_size):
        yield data[i:i + chunk_size]