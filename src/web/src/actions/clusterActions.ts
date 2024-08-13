import { Dispatch } from "react";
import { ActionTypes } from "./common"
import { ClusterService } from "../services/clusterService";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import config from "../config";
import { DbCluster, DbUserFramework } from "../backend/models";

export interface ClusterActions {
    getClusters(userId: string, constellationName: string, clusterBy: string, latest: boolean): Promise<DbCluster[]>;
    setClusters(clusters: DbCluster[]): void;
    getClusterByOptions(userId: string, constellationName: string): Promise<string[]>;
    getClusterBySuggestion(userId: string, constellationName: string): Promise<string>;
    clusterBy(userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): Promise<DbUserFramework[]>;
    setClusterBy(clusterBy: string): void;
}

const clusterService = new ClusterService(config.api.baseUrl)

export const getClusters = (userId: string, constellationName: string, clusterBy: string, latest: boolean): ActionMethod<DbCluster[]> =>
    async (dispatch: Dispatch<GetClustersAction>) => {
        const cluster = await clusterService.getClusters(userId, constellationName, clusterBy, latest);
        dispatch(getClustersAction(cluster))
        return cluster;
    }
export interface GetClustersAction extends PayloadAction<string, DbCluster[]> {
    type: ActionTypes.GET_CLUSTERS
}
const getClustersAction =
    createPayloadAction<GetClustersAction>(ActionTypes.GET_CLUSTERS);

export const setClusters = (clusters: DbCluster[]) =>
    (dispatch: Dispatch<SetClustersAction>) => {
        dispatch(setClustersAction(clusters));
    }
export interface SetClustersAction {
    type: ActionTypes.SET_CLUSTERS,
    clusters: DbCluster[]
}
const setClustersAction = (clusters: DbCluster[]): SetClustersAction => ({
    type: ActionTypes.SET_CLUSTERS,
    clusters: clusters,
});

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

export const clusterBy = (userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): ActionMethod<DbUserFramework[]> => 
    async (dispatch: Dispatch<ClusterByAction>) => {
        const clusters = await clusterService.clusterBy(userId, constellationName, clusterBy, clusterNewOnly)
        dispatch(clusterAction(clusters))
        return clusters;
    }
export interface ClusterByAction extends PayloadAction<string, DbUserFramework[]> {
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