export interface QueryState {
    query?: Query;
    responses?: QueryResponse[];
}

export interface Query {
    userTxt: string;
    source: string
}

export interface QueryResponse {
    title: string;
    source: string;
    content: string;
}

export interface BrowseState {
    source: string;
    responses: BrowseResponse[];
}

export interface BrowseResponse {
    title: string;
    summary: string;
    content: string;
}