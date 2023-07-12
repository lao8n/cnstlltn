export interface QueryState {
    query: Query;
}

export interface Query {
    userTxt: string;
    // selected inputs
}

export interface QueryResponse {
    id?: string;
    created?: Date;
    updated?: Date;
    response: string;
}