import pytest
from unittest.mock import AsyncMock
from api.todo.cluster import _data_to_cluster
from api.todo.models import UserFramework, UserCluster, Coordinates

@pytest.fixture
def user_frameworks():
    return [
        UserFramework(userid="123", constellation="Orion", title="Title1", content="Content1"),
        UserFramework(userid="123", constellation="Orion", title="Title2", content="Content2"),
    ]

@pytest.fixture
def user_clusters():
    return [
        UserCluster(userid="123", constellation="Orion", clusterby="clusterby1", islatest=True, cluster="cluster1", 
                    coordinate=Coordinates(x=1, y=2), frameworks={"1": Coordinates(x=3, y=4)})
    ]

@pytest.mark.asyncio
async def test_data_to_cluster_new_only_false(user_frameworks):
    with patch('todo.UserFramework.find', AsyncMock(return_value=user_frameworks)) as mock_find:
        with patch('todo.UserCluster.find', AsyncMock()) as mock_cluster:
            user_data, clusters, user_clusters_result = await _data_to_cluster("123", "Orion", False)
            assert len(user_data) == 2
            assert clusters == {}
            assert user_clusters_result == []
            mock_find.assert_called_once()
            mock_cluster.assert_not_called()

@pytest.mark.asyncio
async def test_data_to_cluster_new_only_true(user_frameworks, user_clusters):
    with patch('your_module.UserFramework.find', AsyncMock(return_value=user_frameworks)) as mock_find:
        with patch('your_module.UserCluster.find', AsyncMock(return_value=user_clusters)) as mock_cluster:
            user_data, clusters, user_clusters_result = await _data_to_cluster("123", "Orion", True)
            assert len(user_data) == 1  # Assuming one framework is filtered out due to existing cluster
            assert list(clusters.keys()) == ["cluster1"]
            mock_find.assert_called_once()
            mock_cluster.assert_called_once()