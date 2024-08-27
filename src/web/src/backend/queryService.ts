import { Query, QueryResponse, BrowseResponse } from "../state/queryState";
import axios, { AxiosInstance } from 'axios';

export class QueryService {
    protected client: AxiosInstance;

    public constructor(baseUrl: string, baseRoute: string) {
        this.client = axios.create({
            baseURL: `${baseUrl}${baseRoute}`
        });
    }

    public async postQueryResponseList(query: Query): Promise<QueryResponse[]> {
        const response = await this.client.request<QueryResponse[]>({
            method: 'POST',
            data: query
        });
        return response.data;
    }

    public async postBrowse(source: string): Promise<BrowseResponse[]> {
        const response = await this.client.request<BrowseResponse[]>({
            method: 'POST',
            data: source
        });
        return response.data;
    }
}