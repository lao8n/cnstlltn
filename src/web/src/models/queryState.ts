export interface QueryState {
    query?: Query;
    responses?: QueryResponse[];
}

export interface Query {
    userTxt: string;
    // selected inputs
}

export interface QueryResponse {
    id?: string, // TODO: need this to match rest service extends entity - maybe remove?
    title: string;
    content: string;
}