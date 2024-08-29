export interface Browse {
    attachment: boolean;
    material: string;
    messages: BrowseMessage[];
}

export interface BrowseMessage {
    chosen: string;
    responses: BrowseResponse[];
}

export interface BrowseState {
    material: string;
    messages: BrowseMessage[];
}

export interface BrowseResponse {
    title: string;
    source: string;
    flag: boolean;
    content: string;
}