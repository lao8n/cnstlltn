import { Dispatch } from "react";
import { UserFramework } from "../models/userState";
import { ActionTypes } from "./common"
import { QueryResponse } from "../models/queryState";
import config from "../config";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { UserService } from "../services/userService";

const userService = new UserService(config.api.baseUrl);

export interface UserActions {
    setUser(isLoggedIn: boolean, userId: string): void;
    saveSelectedFrameworks(userId: string, frameworks: QueryResponse[]): Promise<QueryResponse[]>;
    getConstellation(): Promise<UserFramework[]>;
}

export const setUser = (isLoggedIn: boolean, userId: string) =>
    (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction(isLoggedIn, userId));
    }

export const saveSelectedFrameworks = (userId: string, frameworks: QueryResponse[]): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<SaveSelectedFrameworksAction>) => {
        // const userInfo = await userService.getUserInfo();
        // console.log("user info ", userInfo)
        // let userId = userInfo[0].user_id;

        console.log("save selected frameworks ", frameworks)
        const savedFrameworks = await userService.saveSelectedFrameworks(userId, frameworks);
        console.log("saved frameworks " + savedFrameworks)
        dispatch(saveSelectedFrameworksAction(frameworks))
        return savedFrameworks
    }

export const getConstellation = (): ActionMethod<UserFramework[]> =>
    async (dispatch: Dispatch<GetConstellationAction>) => {
        const constellation = await userService.getConstellation();
        dispatch(getConstellationAction(constellation))
        return constellation;
    }

export const setConstellation = (constellation: UserFramework[]) =>
    (dispatch: Dispatch<SetConstellationAction>) => {
        dispatch(setConstellationAction(constellation));
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

export interface SaveSelectedFrameworksAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.SAVE_SELECTED_FRAMEWORKS
}

const saveSelectedFrameworksAction =
    createPayloadAction<SaveSelectedFrameworksAction>(ActionTypes.SAVE_SELECTED_FRAMEWORKS);

export interface GetConstellationAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.GET_CONSTELLATION
}

const getConstellationAction =
    createPayloadAction<GetConstellationAction>(ActionTypes.GET_CONSTELLATION);

export interface SetConstellationAction {
    type: ActionTypes.SET_CONSTELLATION,
    constellation: UserFramework[]
}

const setConstellationAction = (constellation: UserFramework[]): SetConstellationAction => ({
    type: ActionTypes.SET_CONSTELLATION,
    constellation: constellation,
});