import { Browse, BrowseResponses } from "../state/browseState";
import axios, { AxiosInstance } from 'axios';

export class BrowseService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async postBrowse(query: Browse): Promise<BrowseResponses> {
        const response = await this.client.request<BrowseResponses>({
            method: 'POST',
            url: `${this.baseUrl}/browse`,
            data: query
        });
        return response.data;
    }
}