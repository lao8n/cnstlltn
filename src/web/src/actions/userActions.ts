import { Dispatch } from "react";
import { LoginConfig, UserFramework, Cluster } from "../models/userState";
import { ActionTypes } from "./common"
import { QueryResponse } from "../models/queryState";
import config from "../config";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { UserService } from "../services/userService";

const userService = new UserService(config.api.baseUrl);

export interface UserActions {
    setUser(isLoggedIn: boolean, userId: string): void;
    saveSelectedFrameworks(userId: string, constellationName: string, frameworks: QueryResponse[]): Promise<QueryResponse[]>;
    getConstellation(userId: string, constellationName: string): Promise<UserFramework[]>;
    getCluster(userId: string, constellationName: string, clusterby: string): Promise<Cluster[]>;
    getClusterSuggestion(userId: string, constellationName: string): Promise<string>;
    cluster(userId: string, constellationName: string, clusterby: string): Promise<UserFramework[]>;
    getLoginConfig(): Promise<LoginConfig>;
}

export const setUser = (isLoggedIn: boolean, userId: string) =>
    (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction(isLoggedIn, userId));
    }

export interface SetUserAction {
    type: ActionTypes.SET_USER,
    isLoggedIn: boolean
    userId: string
}

const setUserAction = (isLoggedIn: boolean, userId: string): SetUserAction => ({
    type: ActionTypes.SET_USER,
    isLoggedIn: isLoggedIn,
    userId: userId,
});

export const saveSelectedFrameworks = (userId: string, constellationName: string, frameworks: QueryResponse[]): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<SaveSelectedFrameworksAction>) => {
        console.log("save selected frameworks ", frameworks)
        const savedFrameworks = await userService.saveSelectedFrameworks(userId, constellationName, frameworks);
        console.log("saved frameworks " + savedFrameworks)
        dispatch(saveSelectedFrameworksAction(frameworks))
        return savedFrameworks
    }

export interface SaveSelectedFrameworksAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.SAVE_SELECTED_FRAMEWORKS
}

const saveSelectedFrameworksAction =
    createPayloadAction<SaveSelectedFrameworksAction>(ActionTypes.SAVE_SELECTED_FRAMEWORKS);

export const getConstellation = (userId: string, constellationName: string): ActionMethod<UserFramework[]> =>
    async (dispatch: Dispatch<GetConstellationAction>) => {
        const constellation = await userService.getConstellation(userId, constellationName);
        dispatch(getConstellationAction(constellation))
        return constellation;
    }

export interface GetConstellationAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.GET_CONSTELLATION
}

const getConstellationAction =
    createPayloadAction<GetConstellationAction>(ActionTypes.GET_CONSTELLATION);

export const setConstellation = (constellation: UserFramework[]) =>
    (dispatch: Dispatch<SetConstellationAction>) => {
        dispatch(setConstellationAction(constellation));
    }

export interface SetConstellationAction {
    type: ActionTypes.SET_CONSTELLATION,
    constellation: UserFramework[]
}

const setConstellationAction = (constellation: UserFramework[]): SetConstellationAction => ({
    type: ActionTypes.SET_CONSTELLATION,
    constellation: constellation,
});

export const setConstellationName = (constellationName: string) =>
    (dispatch: Dispatch<SetConstellationNameAction>) => {
        dispatch(setConstellationNameAction(constellationName));
    }

export interface SetConstellationNameAction {
    type: ActionTypes.SET_CONSTELLATION_NAME,
    constellationName: string
}

const setConstellationNameAction = (constellationName: string): SetConstellationNameAction => ({
    type: ActionTypes.SET_CONSTELLATION_NAME,
    constellationName: constellationName,
});

export const getCluster = (userId: string, constellationName: string, clusterby: string): ActionMethod<Cluster[]> =>
    async (dispatch: Dispatch<GetClusterAction>) => {
        const cluster = await userService.getCluster(userId, constellationName, clusterby);
        dispatch(getClusterAction(cluster))
        return cluster;
    }


export interface GetClusterAction extends PayloadAction<string, Cluster[]> {
    type: ActionTypes.GET_CLUSTER
}

const getClusterAction =
    createPayloadAction<GetClusterAction>(ActionTypes.GET_CLUSTER);

export const getClusterSuggestion = (userId: string, constellationName: string): ActionMethod<string> =>
    async (dispatch: Dispatch<GetClusterSuggestionAction>) => {
        const clusterby = await userService.getClusterSuggestion(userId, constellationName);
        dispatch(getClusterSuggestionAction(clusterby))
            return clusterby;
}
    
export interface GetClusterSuggestionAction extends PayloadAction<string, string> {
    type: ActionTypes.GET_CLUSTER_SUGGESTION
}

const getClusterSuggestionAction =
    createPayloadAction<GetClusterSuggestionAction>(ActionTypes.GET_CLUSTER_SUGGESTION);

export const setClusterBy = (clusterBy: string) =>
    (dispatch: Dispatch<SetClusterByAction>) => {
        dispatch(setClusterByAction(clusterBy));
    }

export interface SetClusterByAction {
    type: ActionTypes.SET_CLUSTER_BY,
    clusterBy: string
}

const setClusterByAction = (clusterBy: string): SetClusterByAction => ({
    type: ActionTypes.SET_CLUSTER_BY,
    clusterBy: clusterBy,
});

export const cluster = (userId: string, constellationName: string, clusterby: string): ActionMethod<UserFramework[]> => 
    async (dispatch: Dispatch<ClusterAction>) => {
        const clusters = await userService.cluster(userId, constellationName, clusterby)
        dispatch(clusterAction(clusters))
        return clusters;
    }

export interface ClusterAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.CLUSTER
}

const clusterAction = 
    createPayloadAction<ClusterAction>(ActionTypes.CLUSTER);

export const setCluster = (cluster: Cluster[]) =>
    (dispatch: Dispatch<SetClusterAction>) => {
        dispatch(setClusterAction(cluster));
    }

export interface SetClusterAction {
    type: ActionTypes.SET_CLUSTER,
    cluster: Cluster[]
}

const setClusterAction = (cluster: Cluster[]): SetClusterAction => ({
    type: ActionTypes.SET_CLUSTER,
    cluster: cluster,
});
    

export const setUpdated = (updated: number) => 
    (dispatch: Dispatch<SetUpdatedAction>) => {
        dispatch(setUpdatedAction(updated));
    }

export interface SetUpdatedAction {
    type: ActionTypes.SET_UPDATED,
    updated: number,
}

const setUpdatedAction = (updated: number): SetUpdatedAction => ({
    type: ActionTypes.SET_UPDATED,
        updated: updated,
});

export const getLoginConfig = (): ActionMethod<LoginConfig> =>
    async (dispatch: Dispatch<GetLoginConfigAction>) => {
        const loginConfig = await userService.getLoginConfig();
        dispatch(getLoginConfigAction(loginConfig))
        return loginConfig;
    }

export interface GetLoginConfigAction extends PayloadAction<string, LoginConfig> {
    type: ActionTypes.GET_LOGIN_CONFIG
}

const getLoginConfigAction = createPayloadAction<GetLoginConfigAction>(ActionTypes.GET_LOGIN_CONFIG);