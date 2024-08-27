import { Dispatch } from "react";
import config from "../../config";
import { QueryService } from "../../backend/queryService";
import { Query, QueryResponse, BrowseResponse, BrowseState } from "../queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl, '/query-ai');

export interface QueryActions {
    postQueryResponseList(query: Query): Promise<QueryResponse[]>;
    setEmptyQueryResponseList(): void;
    postBrowse(source: string): BrowseResponse[];
    pushBrowseState(browseState: BrowseState): void;
    popBrowseState(): BrowseState;
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

export const postBrowse = (source: string): ActionMethod<BrowseResponse[]> =>
    async (dispatch: Dispatch<PostBrowseAction>) => {
        const browseResponses = await queryService.postBrowse(source);
        dispatch(postBrowseAction(browseResponses));
        return browseResponses;
    }

export interface PostBrowseAction {
    type: ActionTypes.POST_BROWSE, payload: BrowseResponse[]
}

const postBrowseAction = (browseResponses: BrowseResponse[]): PostBrowseAction => ({
    type: ActionTypes.POST_BROWSE, payload: browseResponses
});

export const pushBrowseState = (browseState: BrowseState) =>
    (dispatch: Dispatch<PushBrowseStateAction>) => {
        dispatch(pushBrowseStateAction(browseState));
    }

export interface PushBrowseStateAction {
    type: ActionTypes.PUSH_BROWSE_STATE, payload: BrowseState
}

const pushBrowseStateAction = (browseState: BrowseState): PushBrowseStateAction => ({
    type: ActionTypes.PUSH_BROWSE_STATE, payload: browseState
});

export const popBrowseState = () =>
    (dispatch: Dispatch<PopBrowseStateAction>) => {
        dispatch(popBrowseStateAction());
    }

export interface PopBrowseStateAction {
    type: ActionTypes.POP_BROWSE_STATE
}

const popBrowseStateAction = (): PopBrowseStateAction => ({
    type: ActionTypes.POP_BROWSE_STATE
});
