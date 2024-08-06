from typing import List
from api.todo.models import (UserFramework, UserCluster)
from api.todo.models.user_cluster import Coordinates
from openai import OpenAI
from api.todo.app import settings
import json
from random import uniform
from collections import defaultdict

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

async def get_cluster(user_id, constellation_name, cluster_by, latest) -> List[UserCluster]:
    print("get_cluster params:", user_id, constellation_name, cluster_by, latest)
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
    print("get_cluster returns:", user_clusters)
    return user_clusters

async def get_cluster_by_options(user_id, constellation_name) -> List[str]:
    print("get_cluster params:", user_id, constellation_name)
    user_clusters = await UserCluster.find(
        UserCluster.userid == user_id,
        UserCluster.constellation == constellation_name,
    )
    cluster_options = set()
    async for user_cluster in user_clusters:
        cluster_options.add(user_cluster.clusterby)
    cluster_options_list = list(cluster_options)
    print("get_cluster_options returns:", cluster_options_list)
    return cluster_options_list

async def get_cluster_by_suggestion(user_id, constellation_name) -> str:
    print("get_cluster_by_suggestion params:", user_id, constellation_name)
    user_data : List[UserFramework] = await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).to_list()
    prompt_format = f"""
    this prompt is to describe how i want to format your response. i will prompt you with lots of concepts and content
    and i want you to come up with roughly 5-10 categories that could neatly divide them up. 
    you should return these categories as a single comma separated string for example you might suggest below:
    political, economic, sociological, technological, legal, environmental, psychological etc
    you should not return anything else except this single line string\n
    """
    json_data = []
    for data in user_data:
         json_data.append({"title": data.title, "content": data.content})
    json_string = json.dumps(json_data)
    #TODO: handle json_string > max num characters
    response = client.chat.completions.create(
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

async def cluster_by(user_id, constellation_name, cluster_by, cluster_new_only):
    print("get_cluster_by params:", user_id, constellation_name)
    await _set_not_latest(user_id, constellation_name)
    user_data, clusters, user_clusters = await _data_to_cluster(user_id, constellation_name, cluster_new_only)
    print(user_data, clusters, user_clusters)
    prompt_format = f"""
    this prompt is to describe how i want to format your response. i will prompt with something like a list of concepts
    with an id, title and content and clusterby json format
    [{{"id": "id1", "title": "concept 1", "content": "description of concept 1", "clusterby": ""}}, 
     {{"id": "id2", "title": "concept 2", "content": "description of concept 2", "clusterby": ""}}, 
     {{"id": "id3", "title": "concept 3", "content": "description of concept 3", "clusterby": ""}}]
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
    cluster_ids = defaultdict(list) # cluster -> []ids
    new_cluster_ids = defaultdict(list)
    for chunk in _chunk_list(user_data, chunk_size):
        json_data = []
        for data in chunk:
            json_data.append({"id": data.id, "title": data.title, "content": data.content, "clusterby": ""})
        json_string = json.dumps(json_data)
        response = client.chat.completions.create(
            model='gpt-4', # mini doesn't work
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
        response_blocks = json.loads(json_response)
        print(response_blocks)
        for response_block in response_blocks:
            id = response_block['id']
            cluster = response_block['clusterby'].title()
            if cluster not in clusters:
                new_clusters[cluster] = (uniform(0.1, 0.9), uniform(0.1, 0.9))
                new_cluster_ids[cluster].append(id)
            else:
                cluster_ids[cluster].append(id)

    print(cluster_ids, new_clusters, new_cluster_ids)

    await _save_clusters(user_id, constellation_name, user_clusters, clusters, cluster_ids, new_clusters, new_cluster_ids)

async def _set_not_latest(user_id, constellation_name):
    user_clusters = await UserCluster.find(
            UserCluster.userid == user_id,
            UserCluster.constellation == constellation_name,
            UserCluster.islatest == True,
        )
    async for user_cluster in user_clusters:
        user_cluster.islatest = False
        await user_cluster.save()

async def _data_to_cluster(user_id: str, constellation_name: str, cluster_new_only: bool):
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
        )
        framework_keys = set()
        async for user_cluster in user_clusters:
            framework_keys.update(user_cluster.framework.keys())
            clusters[user_cluster.cluster] = user_cluster.coordinate
        user_data = [user_framework for user_framework in user_data if str(user_framework.id) not in framework_keys]
    return user_data, clusters, user_clusters

async def _save_clusters(user_id, constellation_name, user_clusters, clusters, cluster_ids, new_clusters, new_cluster_ids):
    for user_cluster in user_clusters:
        user_cluster.islatest = True
        for id in cluster_ids[user_cluster.cluster]:
            x = clusters[user_cluster.cluster][0] + uniform(-1, 1) / 8
            y = clusters[user_cluster.cluster][1] + uniform(-1, 1) / 8 
            user_cluster.frameworks[id] = Coordinates(x, y)
        await user_cluster.save()
    # new user clusters
    for cluster in new_cluster_ids.keys():
        user_cluster = UserCluster(
            userid = user_id,
            constellation = constellation_name,
            clusterby = cluster_by,
            islatest = True,
            cluster = cluster,
            coordinate = new_clusters[cluster],
        )
        for id in new_cluster_ids[user_cluster.cluster]:
            x = new_clusters[cluster][0] + uniform(-1, 1) / 8
            y = new_clusters[cluster][1] + uniform(-1, 1) / 8 
            user_cluster.frameworks[id] = Coordinates(x, y)
        await user_cluster.save()
    
def _chunk_list(data, chunk_size):
    for i in range(0, len(data), chunk_size):
        yield data[i:i + chunk_size]