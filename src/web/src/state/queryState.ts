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

export interface BrowseState {
    material: string;
    responses: BrowseResponse[];
}

export interface BrowseResponse {
    title: string;
    source: string;
    content: string;
    material: string;
}