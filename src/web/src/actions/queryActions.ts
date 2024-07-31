import { Dispatch } from "react";
import config from "../config";
import { QueryService } from "../services/queryService";
import { Query, QueryResponse } from "../models/queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl, '/query-ai');

export interface QueryActions {
    postQueryResponseList(query: Query): Promise<QueryResponse[]>;
}

export const postQueryResponseList = (query: Query): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<PostQueryResponseListAction>) => {
        console.log("query", query.userTxt)
        try {
            const queryResponses = await queryService.postQueryResponseList(query);
            console.log("query responses", queryResponses)
            dispatch(postQueryResponseListAction(queryResponses));
            console.log("returned query responses")
            return queryResponses
        } catch (error) {
            console.error("Error posting query responses: ", error);
            throw error
        }
}

export interface PostQueryResponseListAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.POST_QUERY_RESPONSE_LIST
}

const postQueryResponseListAction =
    createPayloadAction<PostQueryResponseListAction>(ActionTypes.POST_QUERY_RESPONSE_LIST);

export const setEmptyQueryResponseList = () =>
    (dispatch: Dispatch<SetEmptyQueryResponseListAction>) => {
        dispatch(setEmptyQueryResponseListAction());
    }

export interface SetEmptyQueryResponseListAction {
    type: ActionTypes.SET_EMPTY_QUERY_RESPONSE_LIST,
}

const setEmptyQueryResponseListAction = (): SetEmptyQueryResponseListAction => ({
    type: ActionTypes.SET_EMPTY_QUERY_RESPONSE_LIST,
});