import axios, { AxiosInstance } from 'axios';
import { LoginConfig } from "../state/userState";

export class UserService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async getLoginConfig(): Promise<LoginConfig> {
        const response = await this.client.request<LoginConfig>({
            method: 'GET',
            url: `${this.baseUrl}/login-config`,
        });
        return response.data;
    }

    public async getGoogleUserId(idToken: string): Promise<string> {
        const response = await this.client.request<string>({
            method: 'POST',
            url: `${this.baseUrl}/login/google`,
            data: {
                token: idToken
            }
        });
        return response.data;
    }
}

