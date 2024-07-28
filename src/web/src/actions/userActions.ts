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
    saveSelectedFrameworks(userId: string, constellation: string, frameworks: QueryResponse[]): Promise<QueryResponse[]>;
    getConstellation(userId: string, constellation: string): Promise<UserFramework[]>;
    getCluster(userId: string, constellation: string, clusterby: string): Promise<Cluster[]>;
    cluster(userId: string, constellation: string, clusterby: string): Promise<UserFramework[]>;
    getLoginConfig(): Promise<LoginConfig>;
}

export const setUser = (isLoggedIn: boolean, userId: string) =>
    (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction(isLoggedIn, userId));
    }

export const saveSelectedFrameworks = (userId: string, constellationName: string, frameworks: QueryResponse[]): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<SaveSelectedFrameworksAction>) => {
        // const userInfo = await userService.getUserInfo();
        // console.log("user info ", userInfo)
        // let userId = userInfo[0].user_id;

        console.log("save selected frameworks ", frameworks)
        const savedFrameworks = await userService.saveSelectedFrameworks(userId, constellationName, frameworks);
        console.log("saved frameworks " + savedFrameworks)
        dispatch(saveSelectedFrameworksAction(frameworks))
        return savedFrameworks
    }

export const getConstellation = (userId: string, constellationName: string): ActionMethod<UserFramework[]> =>
    async (dispatch: Dispatch<GetConstellationAction>) => {
        const constellation = await userService.getConstellation(userId, constellationName);
        dispatch(getConstellationAction(constellation))
        return constellation;
    }

export const getCluster = (userId: string, constellationName: string, clusterby: string): ActionMethod<Cluster[]> =>
    async (dispatch: Dispatch<GetClusterAction>) => {
        const cluster = await userService.getCluster(userId, constellationName, clusterby);
        dispatch(getClusterAction(cluster))
        return cluster;
    }

export const cluster = (userId: string, constellationName: string, clusterby: string): ActionMethod<UserFramework[]> => 
    async (dispatch: Dispatch<ClusterAction>) => {
        const clusters = await userService.cluster(userId, constellationName, clusterby)
        dispatch(clusterAction(clusters))
        return clusters;
    }

export const setConstellation = (constellation: UserFramework[]) =>
    (dispatch: Dispatch<SetConstellationAction>) => {
        dispatch(setConstellationAction(constellation));
    }

export const setCluster = (cluster: Cluster[]) =>
    (dispatch: Dispatch<SetClusterAction>) => {
        dispatch(setClusterAction(cluster));
    }

export const getLoginConfig = (): ActionMethod<LoginConfig> =>
    async (dispatch: Dispatch<GetLoginConfigAction>) => {
        const loginConfig = await userService.getLoginConfig();
        dispatch(getLoginConfigAction(loginConfig))
        return loginConfig;
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

export interface SaveSelectedFrameworksAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.SAVE_SELECTED_FRAMEWORKS
}

const saveSelectedFrameworksAction =
    createPayloadAction<SaveSelectedFrameworksAction>(ActionTypes.SAVE_SELECTED_FRAMEWORKS);

export interface GetConstellationAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.GET_CONSTELLATION
}

const getConstellationAction =
    createPayloadAction<GetConstellationAction>(ActionTypes.GET_CONSTELLATION);

export interface GetClusterAction extends PayloadAction<string, Cluster[]> {
    type: ActionTypes.GET_CLUSTER
}

const getClusterAction =
    createPayloadAction<GetClusterAction>(ActionTypes.GET_CLUSTER);

export interface SetConstellationAction {
    type: ActionTypes.SET_CONSTELLATION,
    constellation: UserFramework[]
}

const setConstellationAction = (constellation: UserFramework[]): SetConstellationAction => ({
    type: ActionTypes.SET_CONSTELLATION,
    constellation: constellation,
});

export interface ClusterAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.CLUSTER
}

const clusterAction = 
    createPayloadAction<ClusterAction>(ActionTypes.CLUSTER);

export interface SetClusterAction {
    type: ActionTypes.SET_CLUSTER,
    cluster: Cluster[]
}

const setClusterAction = (cluster: Cluster[]): SetClusterAction => ({
    type: ActionTypes.SET_CLUSTER,
    cluster: cluster,
});

export interface GetLoginConfigAction extends PayloadAction<string, LoginConfig> {
    type: ActionTypes.GET_LOGIN_CONFIG
}

const getLoginConfigAction = createPayloadAction<GetLoginConfigAction>(ActionTypes.GET_LOGIN_CONFIG);