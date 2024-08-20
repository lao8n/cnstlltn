import { Dispatch } from "react";
import { LoginConfig } from "../userState";
import { ActionTypes } from "./common"
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { UserService } from "../../backend/userService";
import config from "../../config";

const userService = new UserService(config.api.baseUrl);

export interface UserActions {
    getGoogleUserId(idToken: string): Promise<string>;
    setUser(isLoggedIn: boolean, userId: string): void;
    getLoginConfig(): Promise<LoginConfig>;
}

export const getGoogleUserId = (idToken: string): ActionMethod<string> =>
    async (dispatch: Dispatch<GetGoogleUserIdAction>) => {
        const userid = await userService.getGoogleUserId(idToken);
        dispatch(getGoogleUserIdAction(userid))
        return userid;
    }

export interface GetGoogleUserIdAction extends PayloadAction<string, string> {
    type: ActionTypes.GET_GOOGLE_USER_ID;
}

const getGoogleUserIdAction = createPayloadAction<GetGoogleUserIdAction>(ActionTypes.GET_GOOGLE_USER_ID);

export const setUser = (isLoggedIn: boolean, userId: string) =>
    (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction(isLoggedIn, userId));
    }

export interface SetUserAction {
    type: ActionTypes.SET_USER,
    isLoggedIn: boolean
    userId: string
}

const setUserAction = (isLoggedIn: boolean, userId: string): SetUserAction => ({
    type: ActionTypes.SET_USER,
    isLoggedIn: isLoggedIn,
    userId: userId,
});

export const getLoginConfig = (): ActionMethod<LoginConfig> =>
    async (dispatch: Dispatch<GetLoginConfigAction>) => {
        const loginConfig = await userService.getLoginConfig();
        dispatch(getLoginConfigAction(loginConfig))
        return loginConfig;
    }

export interface GetLoginConfigAction extends PayloadAction<string, LoginConfig> {
    type: ActionTypes.GET_LOGIN_CONFIG
}

const getLoginConfigAction = createPayloadAction<GetLoginConfigAction>(ActionTypes.GET_LOGIN_CONFIG);