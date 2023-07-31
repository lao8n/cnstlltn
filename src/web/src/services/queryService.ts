import { QueryResponse } from "../models/queryState";
import axios, { AxiosInstance } from 'axios';

export interface Query {
    userTxt: string;
}

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
}