# typing imports
from starlette.requests import Request
from typing import List, Any
from collections import defaultdict
# package imports
import json
from random import uniform
# local imports
from todo.app import app, openai_client
from todo.models import (UserFramework, UserCluster, ClusterResponses)

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

    # get user data
    await _set_not_latest(user_id, constellation_name)
    user_data, clusters, user_clusters = await _data_to_cluster(user_id, constellation_name, cluster_by, cluster_new_only)
    print("data to cluster output:", user_data, clusters, user_clusters)
    
    # prepare request
    system_prompt = f"""
    You are an AI assistant tasked with clustering concepts into categories. Please follow these instructions:
    1. You will be give a list of concepts with an id, title, source, content and tags.
    2. Return a list of the same concepts but with just the id, title and clusterby fields populated. The id and title 
    should be exactly as in the prompt but you will have to decide the clusterby field based upon the this categorisation: 
    {cluster_by}
    3. The clusterby field should be the category that the concept belongs to.
    """
    user_prompt = f"""
        Please categorise the following concepts into the categories: {cluster_by}
    """

    # make openai calls
    completion = openai_client.chat.completions.parse(
        model='gpt-4o', # mini doesn't work
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        response_format=ClusterResponses,
    )

    # process response
    new_clusters = {} # cluster -> coordinates
    all_cluster_ids = defaultdict(list) # cluster -> []ids
    message = completion.choices[0].message
    for response in message.responses:
        if response.title not in clusters and response.title not in new_clusters:
            new_clusters[response.title] = (uniform(0.1, 0.8), uniform(0.1, 0.8))
        all_cluster_ids[response.title].append(response.id)

    print("user_clusters:", user_clusters, " clusters ", clusters, " cluster_ids ", all_cluster_ids)
    print("new_clusters", new_clusters)

    # save clusters
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