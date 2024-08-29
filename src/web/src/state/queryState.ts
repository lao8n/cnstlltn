export interface QueryState {
    query?: Query;
    responses?: QueryResponse[];
}

export interface Query {
    userTxt: string;
    material: string
}

export interface QueryResponse {
    title: string;
    source: string;
    content: string;
}

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