import { QueryResponse } from "../models/queryState";
import axios, { AxiosInstance } from 'axios';
import { UserFramework } from "../models/userState";

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
}