import { Dispatch } from "react";
import config from "../../config";
import { QueryService } from "../../backend/queryService";
import { Query, QueryResponse } from "../queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl);

export interface QueryActions {
    postQueryResponseList(query: Query): Promise<QueryResponse[]>;
    setQueryResponseList(queryResponses: QueryResponse[] | undefined): void;
}

export const postQueryResponseList = (query: Query): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<PostQueryResponseListAction>) => {
        console.log("query", query.userTxt)
        try {
            const queryResponses = await queryService.postQueryResponseList(query);
            console.log("query responses", queryResponses)
            dispatch(postQueryResponseListAction(queryResponses.responses));
            console.log("returned query responses")
            return queryResponses.responses
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

export const setQueryResponseList = (queryResponses: QueryResponse[] | undefined) =>
    (dispatch: Dispatch<SetQueryResponseListAction>) => {
        dispatch(setQueryResponseListAction(queryResponses));
    }
export interface SetQueryResponseListAction {
    type: ActionTypes.SET_QUERY_RESPONSE_LIST,
    payload: QueryResponse[] | undefined
}
const setQueryResponseListAction = (queryResponses: QueryResponse[] | undefined): SetQueryResponseListAction => ({
    type: ActionTypes.SET_QUERY_RESPONSE_LIST,
    payload: queryResponses
});