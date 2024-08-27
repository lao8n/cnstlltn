import * as queryActions from './queryActions';
import * as userActions from './userActions';
import * as constellationActions from './constellationActions'
import * as clusterActions from './clusterActions'
import * as noteActions from './noteActions'
import * as displayActions from './displayActions'

export enum ActionTypes {
    // user 
    SET_USER = "SET_USER",
    GET_LOGIN_CONFIG = "GET_LOGIN_CONFIG",
    GET_GOOGLE_USER_ID = "GET_GOOGLE_USER_ID",
    // query
    POST_QUERY_RESPONSE_LIST = "POST_QUERY_RESPONSE_LIST",
    SET_EMPTY_QUERY_RESPONSE_LIST = "SET_EMPTY_QUERY_RESPONSE_LIST",
    POST_BROWSE = "POST_BROWSE",
    PUSH_BROWSE_STATE = "PUSH_BROWSE_STATE",
    POP_BROWSE_STATE = "POP_BROWSE_STATE",
    // constellation
    SAVE_SELECTED_FRAMEWORKS = "SAVE_SELECTED_FRAMEWORKS",
    EDIT_FRAMEWORK = "EDIT_FRAMEWORK",
    GET_CONSTELLATION = "GET_CONSTELLATION",
    SET_CONSTELLATION = "SET_CONSTELLATION",
    SET_CONSTELLATION_NAME = "SET_CONSTELLATION_NAME",
    // cluster
    GET_CLUSTERS = "GET_CLUSTERS",
    SET_CLUSTERS = "SET_CLUSTERS", 
    CLUSTER_BY = "CLUSTER_BY",
    GET_CLUSTER_BY_OPTIONS = "GET_CLUSTER_BY_OPTIONS",
    GET_CLUSTER_BY_SUGGESTION = "GET_CLUSTER_BY_SUGGESTION",
    SET_CLUSTER_BY = "SET_CLUSTER_BY",
    // note
    SET_SELECTED_CONTENT = "SET_SELECTED_CONTENT",
    // display
    SET_UPDATED = "SET_UPDATED",
}

export type ApplicationActions =
    // user
    userActions.GetGoogleUserIdAction |
    userActions.SetUserAction |
    userActions.GetLoginConfigAction |
    // query
    queryActions.PostQueryResponseListAction |
    queryActions.SetEmptyQueryResponseListAction | 
    queryActions.PostBrowseAction |
    queryActions.PushBrowseStateAction |
    queryActions.PopBrowseStateAction |
    // constellation
    constellationActions.SaveSelectedFrameworksAction | 
    constellationActions.EditFrameworkAction |
    constellationActions.GetConstellationAction |
    constellationActions.SetConstellationAction |
    constellationActions.SetConstellationNameAction |
    // cluster
    clusterActions.GetClustersAction |
    clusterActions.SetClustersAction |
    clusterActions.ClusterByAction |
    clusterActions.GetClusterByOptionsAction |
    clusterActions.GetClusterBySuggestionAction |
    clusterActions.SetClusterByAction | 
    // note
    noteActions.SetSelectedContentAction |
    // display
    displayActions.SetUpdatedAction;
