# import pytest
# from unittest.mock import AsyncMock
# from todo.routes.cluster import get_clusters, UserCluster

# # @pytest.fixture
# # def user_clusters():
# #     return [
# #         UserCluster(userid="123", constellation="Orion", clusterby="clusterby1", islatest=True, cluster="cluster1", 
# #                     coordinate=(1, 2), frameworks={"1": (3, 4)})
# #     ]

# @pytest.mark.asyncio
# async def test_some_user_cluster_functionality():
#     # Your test logic here that uses UserCluster
#     user_cluster = await UserCluster.find_one()
#     assert user_cluster is not None

# @pytest.mark.asyncio
# async def test_get_clusters_latest_true(mocker):
#     # Mock the find method to return a mock that will then mock the to_list method
#     mock_find = mocker.patch('todo.cluster.UserCluster.find', new_callable=AsyncMock)
#     expected_clusters = [UserCluster(userid="user1", constellation="Orion", clusterby="political, technological", islatest=True, cluster="political")]
#     mock_find.return_value.to_list.return_value = expected_clusters

#     # Call the function with parameters
#     result = await get_clusters("user1", "Orion", "political", True)

#     # Check that the result matches the expected mock output
#     assert result == expected_clusters
#     mock_find.assert_called_once_with(
#         UserCluster.userid == "user1",
#         UserCluster.constellation == "Orion",
#         UserCluster.islatest == True
#     )

# @pytest.mark.asyncio
# async def test_get_clusters_latest_false(mocker):
#     # This will use mocker to mock database calls
#     pass