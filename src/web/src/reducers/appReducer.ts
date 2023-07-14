import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "../actions/common";
import { ApplicationState } from "../models/applicationState";

export const appReducer: Reducer<ApplicationState, ApplicationActions> = (state: ApplicationState, action: ApplicationActions): ApplicationState => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            state = { ...state, userState: { isLoggedIn: action.payload.isLoggedIn } };
            break;
        case ActionTypes.GET_QUERY_RESPONSE_LIST:
            state = { ...state, queryState: { responses: action.payload } };
            break;
    }
    return state;
}