import pytest
from unittest.mock import AsyncMock, patch
from api.todo.cluster import _data_to_cluster
from api.todo.models import UserFramework, UserCluster
from api.todo.models.user_cluster import Coordinates

@pytest.mark.asyncio
async def test_data_to_cluster_new_only_false(mock_user_frameworks, mock_user_clusters, initialize_database):
    # Use the initialize_database fixture correctly
    async for _ in initialize_database:
        pass

    # Setup mock return values within context managers
    with patch('api.todo.models.UserFramework.find', new_callable=AsyncMock) as mock_find:
        with patch('api.todo.models.UserCluster.find', new_callable=AsyncMock) as mock_cluster_find:
            mock_find.return_value.to_list = AsyncMock(return_value=mock_user_frameworks)
            mock_cluster_find.return_value.to_list = AsyncMock(return_value=mock_user_clusters)

            # Call the function under test
            user_data, clusters, user_clusters_result = await _data_to_cluster("123", "Orion", False)
            
            # Assertions
            assert len(user_data) == 2
            assert clusters == {}
            assert len(user_clusters_result) == 0  # No clusters should be returned when cluster_new_only is False
            
            # Verify that the find methods were called
            mock_find.assert_called_once()
            mock_cluster_find.assert_called_once()

# @patch('api.todo.models.UserFramework.find', new_callable=AsyncMock)
# @patch('api.todo.models.UserCluster.find', new_callable=AsyncMock)
# @pytest.mark.asyncio
# async def test_data_to_cluster_new_only_false(mock_find, mock_cluster_find, mock_user_frameworks, mock_user_clusters):
#     mock_find.return_value.to_list = AsyncMock(return_value=mock_user_frameworks)
#     mock_cluster_find.return_value.to_list = AsyncMock(return_value=mock_user_clusters)
    
#     user_data, clusters, user_clusters_result = await _data_to_cluster("123", "Orion", True)
    
#     assert len(user_data) == 2
#     assert clusters == {}
#     assert len(user_clusters_result) == 0  # No clusters should be returned when cluster_new_only is False
    
#     mock_find.assert_called_once()
#     mock_cluster_find.assert_called_once()