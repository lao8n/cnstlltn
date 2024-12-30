import { Dispatch } from "react";
import config from "../../config";
import { QueryService } from "../../backend/queryService";
import { Query, QueryResponses } from "../queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl);

export interface QueryActions {
    postQuery(query: Query): Promise<QueryResponses>;
    setQueryResponses(queryResponses: QueryResponses): void;
}

export const postQuery = (query: Query): ActionMethod<QueryResponses> =>
    async (dispatch: Dispatch<PostQueryAction>) => {
        console.log("query", query.userTxt)
        try {
            const queryResponses = await queryService.postQueryResponseList(query);
            console.log("query responses", queryResponses)
            dispatch(postQueryAction(queryResponses));
            console.log("returned query responses")
            return queryResponses
        } catch (error) {
            console.error("Error posting query responses: ", error);
            throw error
        }
}
export interface PostQueryAction extends PayloadAction<string, QueryResponses> {
    type: ActionTypes.POST_QUERY
}
const postQueryAction =
    createPayloadAction<PostQueryAction>(ActionTypes.POST_QUERY);

export const setQueryResponses = (queryResponses: QueryResponses) =>
    (dispatch: Dispatch<SetQueryResponsesAction>) => {
        dispatch(setQueryResponsesAction(queryResponses));
    }
export interface SetQueryResponsesAction extends PayloadAction<string, QueryResponses> {
    type: ActionTypes.SET_QUERY_RESPONSES
}
const setQueryResponsesAction = createPayloadAction<SetQueryResponsesAction>(ActionTypes.SET_QUERY_RESPONSES);