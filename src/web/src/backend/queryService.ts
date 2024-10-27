import { Query, QueryResponses } from "../state/queryState";
import axios, { AxiosInstance } from 'axios';

export class QueryService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async postQueryResponseList(query: Query): Promise<QueryResponses> {
        const response = await this.client.request<QueryResponses>({
            method: 'POST',
            url: `${this.baseUrl}/query-ai`,
            data: query
        });
        return response.data;
    }
}