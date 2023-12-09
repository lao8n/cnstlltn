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

    public async getUserInfo(): Promise<any> {
        try {
            // const response = await this.client.get('/.auth/me');
            // console.log("User info: ", response)
            const response = await this.client.request({
                method: 'POST',
                url: `${this.baseUrl}/.auth/login/google`,
            })
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
            url: `${this.baseUrl}/save-frameworks`,
            data: frameworks,
            headers: { 'USER-ID': userId },
            withCredentials: true,
        });
        return response.data;
    }

    public async getConstellation(): Promise<UserFramework[]> {
        const response = await this.client.request<UserFramework[]>({
            method: 'GET',
            url: `${this.baseUrl}/get-constellation`,
        });
        return response.data;
    }
}

