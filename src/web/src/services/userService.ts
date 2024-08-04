import { QueryResponse } from "../models/queryState";
import axios, { AxiosInstance } from 'axios';
import { LoginConfig, UserFramework, Cluster } from "../models/userState";

export class UserService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async saveSelectedFrameworks(userId: string, constellationName: string, frameworks: QueryResponse[]): Promise<QueryResponse[]> {
        const response = await this.client.request<QueryResponse[]>({
            method: 'POST',
            url: `${this.baseUrl}/save-frameworks`,
            data: frameworks,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName },
            // withCredentials: true,
        });
        return response.data;
    }

    public async getConstellation(userId: string, constellationName: string): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-constellation`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName},
        });
        return response.data;
    }

    public async getCluster(userId: string, constellationName: string, clusterby: string): Promise<Cluster[]> {
        const response = await this.client.request<Cluster[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-cluster`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName, clusterby: clusterby },
        });
        return response.data;
    }

    public async getClusterSuggestion(userId: string, constellationName: string): Promise<string> {
        const response = await this.client.request<string>({
            method: 'GET',
            url: `${this.baseUrl}/get-cluster-suggestion`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName },
        });
        return response.data;
    }

    public async getLoginConfig(): Promise<LoginConfig> {
        const response = await this.client.request<LoginConfig>({
            method: 'GET',
            url: `${this.baseUrl}/login-config`,
        });
        return response.data;
    }

    public async cluster(userId: string, constellationName: string, clusterby: string): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'POST',
            url: `${this.baseUrl}/cluster`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName, clusterby: clusterby },
        });
        return response.data;
    }
}

