import motor
import pytest
from fastapi.testclient import TestClient
from beanie import init_beanie
from api.todo.models.models import Settings
from api.todo.models import UserFramework, UserCluster
from api.todo.models.user_cluster import Coordinates
from unittest.mock import AsyncMock, patch
from api.todo.app import app

TEST_DB_NAME = "test_db"

@pytest.fixture(scope="session", autouse=True)
async def initialize_database():
    # Mock the MongoDB client and init_beanie
    with patch('motor.motor_asyncio.AsyncIOMotorClient') as mock_motor_client:
        mock_db = AsyncMock()
        mock_motor_client.return_value.get_database.return_value = mock_db
        mock_motor_client.return_value[TEST_DB_NAME] = mock_db

        with patch('beanie.init_beanie', new_callable=AsyncMock) as mock_init_beanie:
            await mock_init_beanie(database=mock_db, document_models=[UserFramework, UserCluster])
            yield mock_db

@pytest.fixture
async def mock_user_frameworks(initialize_database):
    async for _ in initialize_database:
        pass
    return [
        UserFramework(userid="123", constellation="Orion", title="Title1", content="Content1"),
        UserFramework(userid="123", constellation="Orion", title="Title2", content="Content2"),
    ]

@pytest.fixture
async def mock_user_clusters(initialize_database):
    async for _ in initialize_database:
        pass
    return [
        UserCluster(userid="123", constellation="Orion", clusterby="clusterby1", islatest=True, cluster="cluster1", 
                    coordinate=Coordinates(coordinate=(1.0, 2.0)), frameworks={"1": Coordinates(coordinate=(3.0, 4.0))})
    ]