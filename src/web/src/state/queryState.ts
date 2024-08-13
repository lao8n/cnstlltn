export interface QueryState {
    query?: Query;
    responses?: QueryResponse[];
}

export interface Query {
    userTxt: string;
}

export interface QueryResponse {
    title: string;
    content: string;
}