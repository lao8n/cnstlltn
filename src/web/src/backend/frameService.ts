import { AxiosInstance } from "axios";

import axios from "axios";
import { FrameResponses, FrameRequest } from "../state/frameState";

export class FrameService {
    protected client: AxiosInstance;
    protected baseUrl: string;

    public constructor(baseUrl: string) {
        this.client = axios.create();
        this.baseUrl = baseUrl;
    }

    public async postFrame(frame: FrameRequest): Promise<FrameResponses> {
        const response = await this.client.request<FrameResponses>({
            method: 'POST',
            url: `${this.baseUrl}/frame`,
            data: frame
        });
        return response.data;
    }
}