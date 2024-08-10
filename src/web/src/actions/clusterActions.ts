import { Dispatch } from "react";
import { UserFramework, Cluster } from "../models/userState";
import { ActionTypes } from "./common"
import { ClusterService } from "../services/clusterService";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import config from "../config";

export interface ClusterActions {
    getCluster(userId: string, constellationName: string, clusterBy: string): Promise<Cluster[]>;
    getClusterByOptions(userId: string, constellationName: string): Promise<string[]>;
    getClusterBySuggestion(userId: string, constellationName: string): Promise<string>;
    clusterBy(userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): Promise<UserFramework[]>;
    setClusterBy(clusterBy: string): void;
    setCluster(cluster: Cluster[]): void;
}

const clusterService = new ClusterService(config.api.baseUrl)

export const getCluster = (userId: string, constellationName: string, clusterBy: string, latest: boolean): ActionMethod<Cluster[]> =>
    async (dispatch: Dispatch<GetClusterAction>) => {
        const cluster = await clusterService.getCluster(userId, constellationName, clusterBy, latest);
        dispatch(getClusterAction(cluster))
        return cluster;
    }
export interface GetClusterAction extends PayloadAction<string, Cluster[]> {
    type: ActionTypes.GET_CLUSTER
}
const getClusterAction =
    createPayloadAction<GetClusterAction>(ActionTypes.GET_CLUSTER);

export const getClusterByOptions = (userId: string, constellationName: string): ActionMethod<string[]> =>
    async (dispatch: Dispatch<GetClusterByOptionsAction>) => {
        const options = await clusterService.getClusterByOptions(userId, constellationName);
        dispatch(getClusterByOptionsAction(options))
        return options;
    }
export interface GetClusterByOptionsAction extends PayloadAction<string, string[]> {
    type: ActionTypes.GET_CLUSTER_BY_OPTIONS
}
const getClusterByOptionsAction =
    createPayloadAction<GetClusterByOptionsAction>(ActionTypes.GET_CLUSTER_BY_OPTIONS);

export const getClusterBySuggestion = (userId: string, constellationName: string): ActionMethod<string> =>
    async (dispatch: Dispatch<GetClusterBySuggestionAction>) => {
        const clusterBy = await clusterService.getClusterBySuggestion(userId, constellationName);
        dispatch(getClusterBySuggestionAction(clusterBy))
            return clusterBy;
}
export interface GetClusterBySuggestionAction extends PayloadAction<string, string> {
    type: ActionTypes.GET_CLUSTER_BY_SUGGESTION
}
const getClusterBySuggestionAction =
    createPayloadAction<GetClusterBySuggestionAction>(ActionTypes.GET_CLUSTER_BY_SUGGESTION);

export const clusterBy = (userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): ActionMethod<UserFramework[]> => 
    async (dispatch: Dispatch<ClusterByAction>) => {
        const clusters = await clusterService.clusterBy(userId, constellationName, clusterBy, clusterNewOnly)
        dispatch(clusterAction(clusters))
        return clusters;
    }
export interface ClusterByAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.CLUSTER_BY
}
const clusterAction = 
    createPayloadAction<ClusterByAction>(ActionTypes.CLUSTER_BY);


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