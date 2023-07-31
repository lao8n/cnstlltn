import { Dispatch } from "react";
import config from "../config";
import { QueryService } from "../services/queryService";
import { Query, QueryResponse } from "../models/queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl, '/queryAi');

export interface QueryActions {
    postQueryResponseList(query: Query): Promise<QueryResponse[]>;
}

export const post = (query: Query): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<PostQueryResponseListAction>) => {
        console.log("query", query.userTxt)
        const queryResponses = await queryService.postQueryResponseList(query);
        console.log("query responses", queryResponses)
    dispatch(postQueryResponseListAction(queryResponses));
    return queryResponses;
}

export interface PostQueryResponseListAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.POST_QUERY_RESPONSE_LIST
}

const postQueryResponseListAction =
    createPayloadAction<PostQueryResponseListAction>(ActionTypes.POST_QUERY_RESPONSE_LIST);