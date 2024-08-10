import axios, { AxiosInstance } from 'axios';
import { UserFramework, Cluster } from "../models/userState";

export class ClusterService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async getCluster(userId: string, constellationName: string, clusterBy: string, latest: boolean): Promise<Cluster[]> {
        const response = await this.client.request<Cluster[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-cluster`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName, clusterBy: clusterBy, latest: latest },
        });
        return response.data;
    }

    public async getClusterByOptions(userId: string, constellationName: string): Promise<string[]> {
        const response = await this.client.request<string[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-cluster-by-options`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName },
        });
        return response.data;
    }

    public async getClusterBySuggestion(userId: string, constellationName: string): Promise<string> {
        const response = await this.client.request<string>({
            method: 'GET',
            url: `${this.baseUrl}/get-cluster-by-suggestion`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName },
        });
        return response.data;
    }

    public async clusterBy(userId: string, constellationName: string, clusterBy: string, clusterNewOnly: boolean): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'POST',
            url: `${this.baseUrl}/cluster-by`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName, clusterBy: clusterBy, clusterNewOnly: clusterNewOnly },
        });
        return response.data;
    }
}