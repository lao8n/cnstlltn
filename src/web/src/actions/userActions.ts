import { Dispatch } from "react";
import { LoginConfig } from "../state/userState";
import { ActionTypes } from "./common"
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { UserService } from "../services/userService";
import config from "../config";

const userService = new UserService(config.api.baseUrl);

export interface UserActions {
    setUser(isLoggedIn: boolean, userId: string): void;
    getLoginConfig(): Promise<LoginConfig>;
}

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