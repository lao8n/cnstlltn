import { Dispatch } from "react";
import config from "../config";
import { QueryService } from "../services/queryService";
import { Query, QueryResponse } from "../models/queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl, '/queryAi');

export interface QueryActions {
    getQueryResponseList(query: Query): Promise<QueryResponse[]>;
}

export const getQueryResponseList = (query: Query): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<GetQueryResponseListAction>) => {
        console.log("query", query.userTxt)
        const queryResponses = await queryService.getQueryResponseList(query);
        console.log("query responses", queryResponses)
    dispatch(getQueryResponseListAction(queryResponses));
    return queryResponses;
}

export interface GetQueryResponseListAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.GET_QUERY_RESPONSE_LIST
}

const getQueryResponseListAction =
    createPayloadAction<GetQueryResponseListAction>(ActionTypes.GET_QUERY_RESPONSE_LIST);