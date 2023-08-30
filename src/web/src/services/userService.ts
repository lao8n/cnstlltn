import { QueryResponse } from "../models/queryState";
import axios, { AxiosInstance } from 'axios';

export class UserService {
    protected client: AxiosInstance;

    public constructor(baseUrl: string, baseRoute: string) {
        this.client = axios.create({
            baseURL: `${baseUrl}${baseRoute}`,
            // withCredentials: true,
        });
    }

    public async saveSelectedFrameworks(frameworks: QueryResponse[]): Promise<QueryResponse[]> {
        try {
            const response = await this.client.request<QueryResponse[]>({
                method: 'POST',
                data: frameworks,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:", error.response?.data');
            } else {
                console.error('Error:", error');
            }
            throw error;
        }
    }
}

