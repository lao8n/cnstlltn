import { Dispatch } from "react";
import { FrameService } from "../../backend/frameService";
import { FrameRequest, FrameResponses } from "../frameState";
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";
import config from "../../config";
import { ActionTypes } from "./common";

const frameService = new FrameService(config.api.baseUrl);

export interface FrameActions {
    postFrame(frameRequest: FrameRequest): Promise<FrameResponses>;
    setFrameResponses(frameResponses: FrameResponses): void;
}

export const postFrame = (frameRequest: FrameRequest): ActionMethod<FrameResponses> =>
    async (dispatch: Dispatch<PostFrameAction>) => {
        const frameResponses = await frameService.postFrame(frameRequest);
        dispatch(postFrameAction(frameResponses));
        return frameResponses;
    }

export interface PostFrameAction extends PayloadAction<string, FrameResponses> {
    type: ActionTypes.POST_FRAME
}

const postFrameAction = createPayloadAction<PostFrameAction>(ActionTypes.POST_FRAME);

export const setFrameResponses = (frameResponses: FrameResponses) =>
    (dispatch: Dispatch<SetFrameResponsesAction>) => {
        dispatch(setFrameResponsesAction(frameResponses));
    }
export interface SetFrameResponsesAction extends PayloadAction<string, FrameResponses> {
    type: ActionTypes.SET_FRAME_RESPONSES
}
const setFrameResponsesAction = createPayloadAction<SetFrameResponsesAction>(ActionTypes.SET_FRAME_RESPONSES);
