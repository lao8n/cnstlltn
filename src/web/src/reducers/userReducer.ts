import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "../actions/common";
import { UserState } from "../models/userState";

export const userReducer: Reducer<UserState, ApplicationActions> = (state: UserState, action: ApplicationActions): UserState => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            state = { ...state,  isLoggedIn: action.payload.isLoggedIn};
            break;
    }
    return state;
}