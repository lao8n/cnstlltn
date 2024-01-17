import { QueryResponse } from "../models/queryState";
import axios, { AxiosInstance } from 'axios';
import { LoginConfig, UserFramework } from "../models/userState";

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

    public async getConstellation(userId: string): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-constellation`,
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

