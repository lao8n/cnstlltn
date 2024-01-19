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

    public async saveSelectedFrameworks(userId: string, frameworks: QueryResponse[]): Promise<QueryResponse[]> {
        const response = await this.client.request<QueryResponse[]>({
            method: 'POST',
            url: `${this.baseUrl}/save-frameworks`,
            data: frameworks,
            headers: { 'USER-ID': userId },
            withCredentials: true,
        });
        return response.data;
    }

    public async getConstellationCluster(userId: string): Promise<[UserFramework[], Cluster[]]> {
        const response = await this.client.request<[UserFramework[], Cluster[]]>({
            method: 'GET',
            url: `${this.baseUrl}/get-constellation-cluster`,
            headers: { 'USER-ID': userId },
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

    public async cluster(userId: string, clusterby: string): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'POST',
            url: `${this.baseUrl}/cluster`,
            headers: { 'USER-ID': userId },
            params: { clusterby: clusterby },
        });
        return response.data;
    }
}

