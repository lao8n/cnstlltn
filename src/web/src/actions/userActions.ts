import { Dispatch } from "react";
import { UserState } from "../models/userState";
import { ActionTypes } from "./common"

export interface UserActions {
    setUser(isLoggedIn: boolean): void;
}

export const setUser = (isLoggedIn: boolean) =>
    (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction({isLoggedIn }));
}

export interface SetUserAction {
    type: ActionTypes.SET_USER,
    payload: UserState
}

const setUserAction = (payload: UserState): SetUserAction => ({
    type: ActionTypes.SET_USER,
    payload
});