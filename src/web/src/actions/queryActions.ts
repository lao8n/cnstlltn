import { Dispatch } from "react";
import config from "../config";
import { QueryService } from "../services/queryService";
import { Query, QueryResponse } from "../models/queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";
import { QueryOptions } from "@testing-library/react";

const queryService = new QueryService(config.api.baseUrl, '/query');

export interface QueryActions {
    getQueryResponseList(query: Query): Promise<QueryResponse[]>;
}

export const getQueryResponseList = (query: QueryOptions): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<GetQueryResponseListAction>) => {
    const queryResponses = await queryService.getList(query);
    dispatch(getQueryResponseListAction(queryResponses));
    return queryResponses;
}

export interface GetQueryResponseListAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.GET_QUERY_RESPONSE_LIST
}

const getQueryResponseListAction =
    createPayloadAction<GetQueryResponseListAction>(ActionTypes.GET_QUERY_RESPONSE_LIST);