from beanie import Document
from pydantic import BaseModel, Field
from typing import Tuple, Dict

class Coordinates(BaseModel):
    coordinate: Tuple[float, float]

class UserCluster(Document):
    userid: str
    constellation: str
    clusterby: str
    islatest: bool
    cluster: str
    coordinate: Coordinates
    frameworks: Dict[str, Coordinates] = Field(default_factory=dict) # object id as key
    class Settings:
        collection = "user_clusters"