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
    content: string;
}