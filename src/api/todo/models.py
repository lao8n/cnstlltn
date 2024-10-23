# typing imports
from typing import Dict, Tuple, List
# package imports
from beanie import Document
from pydantic import BaseModel, Field

# login
class Token(BaseModel):
    token: str

class UserId(Document):
    userid: str
    googleid: str

class LoginConfig(BaseModel):
    googleClientId: str

# prompt
class Query(BaseModel):
    userTxt: str
    material: str

class QueryAiResponseBlock(BaseModel):
    title: str  
    source: str
    content: str

# browse
class BrowseResponseBlock(BaseModel):
    title: str
    source: str
    flag: bool
    content: str

class BrowseMessage(BaseModel):
    chosen: str
    responses: List[BrowseResponseBlock]

class Browse(BaseModel):
    attachment: bool
    material: str
    messages: List[BrowseMessage] = []

# cluster
class UserCluster(Document):
    userid: str
    constellation: str
    clusterby: str
    cluster: str
    islatest: bool = False
    coordinate: Tuple[float, float] = (0, 0)
    frameworks: Dict[str, Tuple[float, float]] = Field(default_factory=dict) # object id as key

# notes
class Framework(BaseModel):
    title: str
    source: str
    content: str

class UserFramework(Document):
    userid: str
    constellation: str
    title: str
    content: str
    source: str = ""
    tags: List[str] = []

__beanie_models__ = [UserFramework, UserCluster, UserId]