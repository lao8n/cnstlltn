import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "../actions/common";
import { QueryResponse } from "../models/queryState";

export const queryReducer: Reducer<QueryResponse[], ApplicationActions> = (state: QueryResponse[], action: ApplicationActions): QueryResponse[] => {
    switch (action.type) {
        case ActionTypes.GET_QUERY_RESPONSE_LIST:
            state = [...action.payload];
            break;
    }
    return state;
}