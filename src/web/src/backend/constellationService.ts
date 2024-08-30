import { QueryResponse } from "../state/queryState";
import axios, { AxiosInstance } from 'axios';
import { DbUserFramework } from "./models";

export class ConstellationService {
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

    public async editFramework(userId: string, framework: DbUserFramework): Promise<DbUserFramework> {
        const response = await this.client.request<DbUserFramework>({
            method: 'POST',
            url: `${this.baseUrl}/edit-framework`,
            data: framework,
            headers: { 'USER-ID': userId },
        });
        return response.data;
    }

    public async deleteFramework(userId: string, framework: DbUserFramework): Promise<DbUserFramework> {
        const response = await this.client.request<DbUserFramework>({
            method: 'POST',
            url: `${this.baseUrl}/delete-framework`,
            data: framework,
            headers: { 'USER-ID': userId },
        });
        return response.data;
    }

    public async getConstellation(userId: string, constellationName: string): Promise<DbUserFramework[]> {
        const response = await this.client.request<DbUserFramework[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-constellation`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName},
        });
        return response.data;
    }

    public async deleteConstellation(userId: string, constellationName: string): Promise<void> {
        await this.client.request({
            method: 'POST',
            url: `${this.baseUrl}/delete-constellation`,
            headers: { 'USER-ID': userId },
            params: { constellationName: constellationName},
        });
    }
}