import { QueryResponse } from "../models/queryState";
import axios, { AxiosInstance } from 'axios';
import { UserFramework } from "../models/userState";

export class UserService {
    protected client: AxiosInstance;

    public constructor(baseUrl: string, baseRoute: string) {
        this.client = axios.create({
            baseURL: `${baseUrl}${baseRoute}`,
        });
    }

    public async saveSelectedFrameworks(frameworks: QueryResponse[]): Promise<QueryResponse[]> {
        const response = await this.client.request<QueryResponse[]>({
            method: 'POST',
            data: frameworks,
        });
        return response.data;
    }

    public async getConstellation(): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'GET',
        });
        return response.data;
    }
}

