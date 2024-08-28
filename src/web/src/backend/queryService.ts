import { Query, QueryResponse, BrowseResponse } from "../state/queryState";
import axios, { AxiosInstance } from 'axios';

export class QueryService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async postQueryResponseList(query: Query): Promise<QueryResponse[]> {
        const response = await this.client.request<QueryResponse[]>({
            method: 'POST',
            url: `${this.baseUrl}/query-ai`,
            data: query
        });
        return response.data;
    }

    public async postBrowse(source: string): Promise<BrowseResponse[]> {
        const response = await this.client.request<BrowseResponse[]>({
            method: 'POST',
            url: `${this.baseUrl}/browse`,
            data: source
        });
        return response.data;
    }
}