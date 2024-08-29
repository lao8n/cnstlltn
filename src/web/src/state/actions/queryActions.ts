import { Dispatch } from "react";
import config from "../../config";
import { QueryService } from "../../backend/queryService";
import { Query, QueryResponse, Browse, BrowseResponse, BrowseMessage } from "../queryState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";

const queryService = new QueryService(config.api.baseUrl);

export interface QueryActions {
    postQueryResponseList(query: Query): Promise<QueryResponse[]>;
    setQueryResponseList(queryResponses: QueryResponse[] | undefined): void;
    postBrowse(query: Browse): Promise<BrowseResponse[]>;
    setBrowseMaterial(material: string): void;
    pushBrowseMessage(browseMessage: BrowseMessage): void;
    popBrowseMessage(): void;
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

export const postBrowse = (query: Browse): ActionMethod<BrowseResponse[]> =>
    async (dispatch: Dispatch<PostBrowseAction>) => {
        const browseResponses = await queryService.postBrowse(query);
        dispatch(postBrowseAction(browseResponses));
        return browseResponses;
    }
export interface PostBrowseAction extends PayloadAction<string, BrowseResponse[]> {
    type: ActionTypes.POST_BROWSE, payload: BrowseResponse[]
}
const postBrowseAction = (browseResponses: BrowseResponse[]): PostBrowseAction => ({
    type: ActionTypes.POST_BROWSE, payload: browseResponses
});

export const setBrowseMaterial = (material: string) =>
    (dispatch: Dispatch<SetBrowseMaterialAction>) => {
        dispatch(setBrowseMaterialAction(material));
    }
export interface SetBrowseMaterialAction {
    type: ActionTypes.SET_BROWSE_MATERIAL, payload: string
}
const setBrowseMaterialAction = (material: string): SetBrowseMaterialAction => ({
    type: ActionTypes.SET_BROWSE_MATERIAL, payload: material
});

export const pushBrowseMessage = (browseMessage: BrowseMessage) =>
    (dispatch: Dispatch<PushBrowseMessageAction>) => {
        dispatch(pushBrowseMessageAction(browseMessage));
    }
export interface PushBrowseMessageAction {
    type: ActionTypes.PUSH_BROWSE_MESSAGE, payload: BrowseMessage
}
const pushBrowseMessageAction = (browseMessage: BrowseMessage): PushBrowseMessageAction => ({
    type: ActionTypes.PUSH_BROWSE_MESSAGE, payload: browseMessage
});

export const popBrowseMessage = () =>
    (dispatch: Dispatch<PopBrowseMessageAction>) => {
        dispatch(popBrowseMessageAction());
    }
export interface PopBrowseMessageAction {
    type: ActionTypes.POP_BROWSE_MESSAGE
}
const popBrowseMessageAction = (): PopBrowseMessageAction => ({
    type: ActionTypes.POP_BROWSE_MESSAGE
});
