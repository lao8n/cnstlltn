export interface FrameResponse {
    title: string;
    steelman: string;
    strawman: string;
}

export interface FrameResponses {
    responses: FrameResponse[];
}

export interface FrameRequest {
    argument: string;
    frameworks: Framework[];
}

export interface Framework {
    title: string;
    source: string;
    content: string;
}
