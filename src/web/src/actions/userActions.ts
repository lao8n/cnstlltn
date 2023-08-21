import { Dispatch } from "react";
import { UserState } from "../models/userState";
import { ActionTypes } from "./common"
import { QueryResponse } from "../models/queryState";
import config from "../config";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { UserService } from "../services/userService";

const userService = new UserService(config.api.baseUrl, '/save-frameworks');

export interface UserActions {
    setUser(isLoggedIn: boolean): void;
    saveSelectedFrameworks(frameworks: QueryResponse[]): Promise<QueryResponse[]>;
}

export const setUser = (isLoggedIn: boolean) =>
    (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction({isLoggedIn }));
}

export const saveSelectedFrameworks = (frameworks: QueryResponse[]): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<SaveSelectedFrameworksAction>) => {
        console.log("save selected frameworks ", frameworks)
        const savedFrameworks = await userService.saveSelectedFrameworks(frameworks);
        console.log("saved frameworks " + savedFrameworks)
        dispatch(saveSelectedFrameworksAction(frameworks))
        return savedFrameworks
}

export interface SetUserAction {
    type: ActionTypes.SET_USER,
    payload: UserState
}

const setUserAction = (payload: UserState): SetUserAction => ({
    type: ActionTypes.SET_USER,
    payload: payload,
});

export interface SaveSelectedFrameworksAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.SAVE_SELECTED_FRAMEWORKS
}

const saveSelectedFrameworksAction =
    createPayloadAction<SaveSelectedFrameworksAction>(ActionTypes.SAVE_SELECTED_FRAMEWORKS);