export interface QueryState {
    query?: Query;
    responses?: QueryResponse[];
}

export interface Query {
    userTxt: string;
    // selected inputs
}

export interface QueryResponse {
    title: string;
    content: string;
}