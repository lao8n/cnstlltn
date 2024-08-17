import { Dispatch } from "react";
import { ActionTypes } from "./common"
import { ClusterService } from "../../backend/clusterService";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import config from "../../config";
import { Cluster, UserFramework } from "../userState";
import { mapDbClusterToCluster, mapDbUserFrameworkToUserFramework } from "../../backend/mappers";

export interface ClusterActions {
    getClusters(userId: string, constellationName: string, clusterBy: string, latest: boolean): Promise<Cluster[]>;
    setClusters(clusters: Cluster[]): void;
    getClusterByOptions(userId: string, constellationName: string): Promise<string[]>;
    getClusterBySuggestion(userId: string, constellationName: string): Promise<string>;
    clusterBy(userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): Promise<UserFramework[]>;
    setClusterBy(clusterBy: string): void;
}

const clusterService = new ClusterService(config.api.baseUrl)

export const getClusters = (userId: string, constellationName: string, clusterBy: string, latest: boolean): ActionMethod<Cluster[]> =>
    async (dispatch: Dispatch<GetClustersAction>) => {
        const clusterDb = await clusterService.getClusters(userId, constellationName, clusterBy, latest);
        const cluster = clusterDb.map(clusterDb => mapDbClusterToCluster(clusterDb));
        dispatch(getClustersAction(cluster))
        return cluster;
    }
export interface GetClustersAction extends PayloadAction<string, Cluster[]> {
    type: ActionTypes.GET_CLUSTERS
}
const getClustersAction =
    createPayloadAction<GetClustersAction>(ActionTypes.GET_CLUSTERS);

export const setClusters = (clusters: Cluster[]) =>
    (dispatch: Dispatch<SetClustersAction>) => {
        dispatch(setClustersAction(clusters));
    }
export interface SetClustersAction {
    type: ActionTypes.SET_CLUSTERS,
    clusters: Cluster[]
}
const setClustersAction = (clusters: Cluster[]): SetClustersAction => ({
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

export const clusterBy = (userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): ActionMethod<UserFramework[]> => 
    async (dispatch: Dispatch<ClusterByAction>) => {
        const constellationsDb = await clusterService.clusterBy(userId, constellationName, clusterBy, clusterNewOnly)
        const constellations = constellationsDb.map(constellationDb => mapDbUserFrameworkToUserFramework(constellationDb));
        dispatch(clusterAction(constellations))
        return constellations;
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