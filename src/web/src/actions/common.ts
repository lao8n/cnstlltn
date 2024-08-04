import * as queryActions from './queryActions';
import * as userActions from './userActions';

// 3 categories of data
// 1. query data
// 2. user data
// 3. display data

export enum ActionTypes {
    // user 
    SET_USER = "SET_USER",
    // frameworks
    SAVE_SELECTED_FRAMEWORKS = "SAVE_SELECTED_FRAMEWORKS",
    POST_QUERY_RESPONSE_LIST = "POST_QUERY_RESPONSE_LIST",
    SET_EMPTY_QUERY_RESPONSE_LIST = "SET_EMPTY_QUERY_RESPONSE_LIST",
    // constellation
    GET_CONSTELLATION = "GET_CONSTELLATION",
    SET_CONSTELLATION = "SET_CONSTELLATION",
    SET_CONSTELLATION_NAME = "SET_CONSTELLATION_NAME",
    // cluster
    GET_CLUSTER = "GET_CLUSTER",
    GET_CLUSTER_SUGGESTION = "GET_CLUSTER_SUGGESTION",
    CLUSTER = "CLUSTER",
    SET_CLUSTER = "SET_CLUSTER", 
    // misc
    SET_UPDATED = "SET_UPDATED",
    GET_LOGIN_CONFIG = "GET_LOGIN_CONFIG",
}

export type ApplicationActions =
    // user 
    userActions.SetUserAction |
    // frameworks
    userActions.SaveSelectedFrameworksAction |
    queryActions.PostQueryResponseListAction |
    queryActions.SetEmptyQueryResponseListAction | 
    // constelation
    userActions.GetConstellationAction |
    userActions.SetConstellationAction |
    userActions.SetConstellationNameAction |
    // cluster
    userActions.GetClusterAction |
    userActions.GetClusterSuggestionAction |
    userActions.ClusterAction |
    userActions.SetClusterAction |
    // misc
    userActions.SetUpdatedAction |
    userActions.GetLoginConfigAction;
