import * as queryActions from './queryActions';
import * as userActions from './userActions';
import * as constellationActions from './constellationActions'
import * as clusterActions from './clusterActions'
import * as displayActions from './displayActions'

export enum ActionTypes {
    // user 
    SET_USER = "SET_USER",
    GET_LOGIN_CONFIG = "GET_LOGIN_CONFIG",
    // query
    POST_QUERY_RESPONSE_LIST = "POST_QUERY_RESPONSE_LIST",
    SET_EMPTY_QUERY_RESPONSE_LIST = "SET_EMPTY_QUERY_RESPONSE_LIST",
    // constellation
    SAVE_SELECTED_FRAMEWORKS = "SAVE_SELECTED_FRAMEWORKS",
    GET_CONSTELLATION = "GET_CONSTELLATION",
    SET_CONSTELLATION = "SET_CONSTELLATION",
    SET_CONSTELLATION_NAME = "SET_CONSTELLATION_NAME",
    // cluster
    GET_CLUSTERS = "GET_CLUSTERS",
    SET_CLUSTERS = "SET_CLUSTERS", 
    GET_CLUSTER_BY_OPTIONS = "GET_CLUSTER_BY_OPTIONS",
    GET_CLUSTER_BY_SUGGESTION = "GET_CLUSTER_BY_SUGGESTION",
    CLUSTER_BY = "CLUSTER_BY",
    SET_CLUSTER_BY = "SET_CLUSTER_BY",
    // display
    SET_UPDATED = "SET_UPDATED",
    SET_SELECTED_CONTENT = "SET_SELECTED_CONTENT",
}

export type ApplicationActions =
    // user
    userActions.SetUserAction |
    userActions.GetLoginConfigAction |
    // query
    queryActions.PostQueryResponseListAction |
    queryActions.SetEmptyQueryResponseListAction | 
    // constellation
    constellationActions.SaveSelectedFrameworksAction | 
    constellationActions.GetConstellationAction |
    constellationActions.SetConstellationAction |
    constellationActions.SetConstellationNameAction |
    // cluster
    clusterActions.GetClustersAction |
    clusterActions.SetClustersAction |
    clusterActions.GetClusterByOptionsAction |
    clusterActions.GetClusterBySuggestionAction |
    clusterActions.ClusterByAction |
    clusterActions.SetClusterByAction | 
    // display
    displayActions.SetUpdatedAction |
    displayActions.SetSelectedContentAction;
