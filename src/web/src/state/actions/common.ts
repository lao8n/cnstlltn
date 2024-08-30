import * as queryActions from './queryActions';
import * as userActions from './userActions';
import * as constellationActions from './constellationActions'
import * as clusterActions from './clusterActions'
import * as noteActions from './noteActions'
import * as displayActions from './displayActions'
import * as browseActions from './browseActions'

export enum ActionTypes {
    // user 
    SET_USER = "SET_USER",
    GET_LOGIN_CONFIG = "GET_LOGIN_CONFIG",
    GET_GOOGLE_USER_ID = "GET_GOOGLE_USER_ID",
    // query
    POST_QUERY_RESPONSE_LIST = "POST_QUERY_RESPONSE_LIST",
    SET_QUERY_RESPONSE_LIST = "SET_QUERY_RESPONSE_LIST",
    // browse
    POST_BROWSE = "POST_BROWSE",
    SET_BROWSE_MATERIAL = "SET_BROWSE_MATERIAL",
    SET_BROWSE_MESSAGES = "SET_BROWSE_MESSAGES",
    SET_BROWSE_CHOSEN = "SET_BROWSE_CHOSEN",
    PUSH_BROWSE_MESSAGE = "PUSH_BROWSE_MESSAGE",
    POP_BROWSE_MESSAGE = "POP_BROWSE_MESSAGE",
    // constellation
    SAVE_SELECTED_FRAMEWORKS = "SAVE_SELECTED_FRAMEWORKS",
    GET_CONSTELLATION = "GET_CONSTELLATION",
    DELETE_CONSTELLATION = "DELETE_CONSTELLATION",
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
    EDIT_FRAMEWORK = "EDIT_FRAMEWORK",
    DELETE_FRAMEWORK = "DELETE_FRAMEWORK",
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
    queryActions.SetQueryResponseListAction |
    // browse
    browseActions.PostBrowseAction |
    browseActions.SetBrowseMaterialAction |
    browseActions.SetBrowseMessagesAction |
    browseActions.SetBrowseChosenAction |
    browseActions.PushBrowseMessageAction |
    browseActions.PopBrowseMessageAction |
    // constellation
    constellationActions.SaveSelectedFrameworksAction | 
    constellationActions.GetConstellationAction |
    constellationActions.DeleteConstellationAction |
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
    noteActions.EditFrameworkAction |
    noteActions.DeleteFrameworkAction |
    // display
    displayActions.SetUpdatedAction;
