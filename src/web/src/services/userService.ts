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

    public async getUserInfo(): Promise<any> {
        try {
            const response = await this.client.get('/.auth/me');
            console.log("User info: ", response)
            return response.data;
        } catch (error) {
            console.error("Error getting user info: ", error);
            throw error
        }
    }

    public async saveSelectedFrameworks(userId: string, frameworks: QueryResponse[]): Promise<QueryResponse[]> {
        const response = await this.client.request<QueryResponse[]>({
            method: 'POST',
            data: frameworks,
            headers: {'USER-ID': userId}
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

