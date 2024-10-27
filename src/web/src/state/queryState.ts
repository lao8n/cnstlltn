export interface QueryState {
    query?: Query;
    responses?: QueryResponse[];
}

export interface Query {
    userTxt: string;
    material: string
}

export interface QueryResponses {
    responses: QueryResponse[];
}

export interface QueryResponse {
    title: string;
    source: string;
    content: string;
}