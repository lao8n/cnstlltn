import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "./actions/common";
import { ApplicationState } from "../state/applicationState";
import { mapDbClusterToCluster, mapDbUserFrameworkToUserFramework } from "../backend/mappers";

export const appReducer: Reducer<ApplicationState, ApplicationActions> = (state: ApplicationState, action: ApplicationActions): ApplicationState => {
    switch (action.type) {
        // user
        case ActionTypes.SET_USER:
            state.userState = { ...state.userState, isLoggedIn: action.isLoggedIn, userId: action.userId };
            break;
        case ActionTypes.GET_LOGIN_CONFIG:
            break;
        // query
        case ActionTypes.POST_QUERY_RESPONSE_LIST:
            state.queryState.responses = action.payload;
            state.queryState.responses?.forEach((response) => {
                console.log("response title ", response.title + " content " + response.content)
            })
            break;
        case ActionTypes.SET_EMPTY_QUERY_RESPONSE_LIST:
            state.queryState.responses = undefined;
            break;
        // constellation
        case ActionTypes.SAVE_SELECTED_FRAMEWORKS:
            break;
        case ActionTypes.GET_CONSTELLATION:
            break;
        case ActionTypes.SET_CONSTELLATION:
            state.userState.constellation = action.constellation.map(dbUserFramework => mapDbUserFrameworkToUserFramework(dbUserFramework));
            break;
        case ActionTypes.SET_CONSTELLATION_NAME:
            state.userState.constellationName = action.constellationName;
            break;
        // cluster
        case ActionTypes.GET_CLUSTERS:
            break;
        case ActionTypes.SET_CLUSTERS:
            state.userState.clusters = action.clusters.map(dbCluster => mapDbClusterToCluster(dbCluster));
            break;
        case ActionTypes.GET_CLUSTER_BY_OPTIONS:
            break;
        case ActionTypes.GET_CLUSTER_BY_SUGGESTION:
            break;
        case ActionTypes.CLUSTER_BY:
            break;
        case ActionTypes.SET_CLUSTER_BY:
            state.userState.clusterBy = action.clusterBy;
            break;
        // display
        case ActionTypes.SET_UPDATED:
            state.userState.updated = action.updated;
            break;
        case ActionTypes.SET_SELECTED_CONTENT:
            state.userState.selectedContent = action.selected;
            break;
        default:
            console.log("reducer state not updated {action.type}")
            break;
    }
    return { ...state};
}

export default appReducer;