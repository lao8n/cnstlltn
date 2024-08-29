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