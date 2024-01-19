from datetime import datetime
from enum import Enum
from typing import Optional, List
from typing import Dict, Tuple

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, BaseSettings, Field

def keyvault_name_as_attr(name: str) -> str:
    return name.replace("-", "_").upper()


class Settings(BaseSettings):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Load secrets from keyvault
        if self.AZURE_KEY_VAULT_ENDPOINT:
            credential = DefaultAzureCredential()
            keyvault_client = SecretClient(self.AZURE_KEY_VAULT_ENDPOINT, credential)
            for secret in keyvault_client.list_properties_of_secrets():
                setattr(
                    self,
                    keyvault_name_as_attr(secret.name),
                    keyvault_client.get_secret(secret.name).value,
                )

    AZURE_COSMOS_CONNECTION_STRING: str = ""
    AZURE_COSMOS_DATABASE_NAME: str = "Todo"
    AZURE_KEY_VAULT_ENDPOINT: Optional[str] = None
    APPLICATIONINSIGHTS_CONNECTION_STRING: Optional[str] = None
    APPLICATIONINSIGHTS_ROLENAME: Optional[str] = "API"
    OPENAI_API_KEY: str = ""
    GOOGLE_LOGIN_CLIENT_SECRET: Optional[str] = None 
    GOOGLE_LOGIN_CLIENT_ID: Optional[str] = None 
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

class Query(BaseModel):
    userTxt: str

class QueryAiResponseBlock(BaseModel):
    title: str    
    content: str

class LoginConfig(BaseModel):
    googleClientId: str

class Framework(BaseModel):
    title: str
    content: str

class Cluster(BaseModel):
    cluster: str
    coordinate: Tuple[float, float]

class UserCluster(BaseModel):
    userid: str
    cluster: str
    coordinate: Tuple[float, float]

class UserFramework(Document):
    userid: str # partition key
    # unique id -> cosmos can automatically generate this
    title: str
    content: str
    clusterby: Dict[str, Cluster] = Field(default_factory=dict)

__beanie_models__ = [UserFramework, UserCluster]
