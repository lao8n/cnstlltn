from typing import Optional
from typing import Dict, Tuple, List

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from beanie import Document
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings

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

class Token(BaseModel):
    token: str

class Query(BaseModel):
    userTxt: str
    source: str

class QueryAiResponseBlock(BaseModel):
    title: str  
    source: str
    content: str

class LoginConfig(BaseModel):
    googleClientId: str

class Framework(BaseModel):
    title: str
    content: str

class UserFramework(Document):
    userid: str
    constellation: str
    title: str
    content: str
    source: str = ""
    tags: List[str] = []
    

class UserCluster(Document):
    userid: str
    constellation: str
    clusterby: str
    cluster: str
    islatest: bool = False
    coordinate: Tuple[float, float] = (0, 0)
    frameworks: Dict[str, Tuple[float, float]] = Field(default_factory=dict) # object id as key

class UserId(Document):
    userid: str
    googleid: str

__beanie_models__ = [UserFramework, UserCluster, UserId]