# typing imports
from typing import List, Dict
from starlette.requests import Request
# package imports
from random import uniform
# local imports
from todo.app import app
from todo.models import (UserFramework, UserCluster, Framework)

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
            source=framework.source,
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

@app.post("/delete-framework", response_model=UserFramework, status_code=200)
async def delete_framework(request: Request, framework: UserFramework) -> UserFramework:
    print("delete_framework: ", framework)
    existing_framework = await UserFramework.get(framework.id)
    if existing_framework is not None:
        await existing_framework.delete()
        # Delete references to the framework ID from all user clusters
        user_clusters = await UserCluster.find(
            UserCluster.userid == existing_framework.userid,
            UserCluster.constellation == existing_framework.constellation
        ).to_list()
        
        for cluster in user_clusters:
            if str(existing_framework.id) in cluster.frameworks:
                del cluster.frameworks[str(existing_framework.id)]
                await cluster.save()
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

@app.post("/delete-constellation", response_model=Dict[str, str], status_code=200)
async def delete_constellation(request: Request) -> Dict[str, str]:
    print("delete_constellation")
    user_id = request.headers.get("user-id")
    constellation_name = request.query_params.get("constellationName")
    
    # Delete UserFrameworks
    await UserFramework.find(
        UserFramework.userid == user_id,
        UserFramework.constellation == constellation_name,
    ).delete()
    
    # Delete UserClusters
    await UserCluster.find(
        UserCluster.userid == user_id,
        UserCluster.constellation == constellation_name,
    ).delete()
    
    return {"message": f"Constellation '{constellation_name}' deleted successfully"}
        