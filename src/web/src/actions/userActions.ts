import { Dispatch } from "react";
import { UserState } from "../models/userState";
import { PayloadAction, createPayloadAction } from "./actionCreators"
import { ActionTypes } from "./common"

export interface UserActions {
    setUser(): void;
}

export const setUser = () =>
    async (dispatch: Dispatch<SetUserAction>) => {
        dispatch(setUserAction({ isLoggedIn: true }));
}

export interface SetUserAction extends PayloadAction<string, UserState> {
    type: ActionTypes.SET_USER
}
const setUserAction = createPayloadAction<SetUserAction>(ActionTypes.SET_USER);