import { Dispatch } from "react";
import config from "../../config";
import { Browse, BrowseResponse, BrowseMessage } from "../browseState";
import { ActionMethod, PayloadAction } from "./actionCreators";
import { ActionTypes } from "./common";
import { BrowseService } from "../../backend/browseService";

const browseService = new BrowseService(config.api.baseUrl);

export interface BrowseActions {
    postBrowse(query: Browse): Promise<BrowseResponse[]>;
    setBrowseMaterial(material: string): void;
    setBrowseMessages(messages: BrowseMessage[]): void;
    setBrowseChosen(chosen: string): void;
    pushBrowseMessage(browseMessage: BrowseMessage): void;
    popBrowseMessage(): void;
}


export const postBrowse = (query: Browse): ActionMethod<BrowseResponse[]> =>
    async (dispatch: Dispatch<PostBrowseAction>) => {
        const browseResponses = await browseService.postBrowse(query);
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

export const setBrowseMessages = (messages: BrowseMessage[]) =>
    (dispatch: Dispatch<SetBrowseMessagesAction>) => {
        dispatch(setBrowseMessagesAction(messages));
    }
export interface SetBrowseMessagesAction {
    type: ActionTypes.SET_BROWSE_MESSAGES, payload: BrowseMessage[]
}
const setBrowseMessagesAction = (messages: BrowseMessage[]): SetBrowseMessagesAction => ({
    type: ActionTypes.SET_BROWSE_MESSAGES, payload: messages
});

export const setBrowseChosen = (chosen: string) =>
    (dispatch: Dispatch<SetBrowseChosenAction>) => {
        dispatch(setBrowseChosenAction(chosen));
    }
export interface SetBrowseChosenAction {
    type: ActionTypes.SET_BROWSE_CHOSEN, payload: string
}
const setBrowseChosenAction = (chosen: string): SetBrowseChosenAction => ({
    type: ActionTypes.SET_BROWSE_CHOSEN, payload: chosen
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
