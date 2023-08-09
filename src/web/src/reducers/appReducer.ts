import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "../actions/common";
import { ApplicationState } from "../models/applicationState";

export const appReducer: Reducer<ApplicationState, ApplicationActions> = (state: ApplicationState, action: ApplicationActions): ApplicationState => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            state = { ...state, userState: { isLoggedIn: action.payload.isLoggedIn } };
            break;
        case ActionTypes.POST_QUERY_RESPONSE_LIST:
            state = { ...state, queryState: { responses: action.payload } };
            console.log("reducer state updated " + state.queryState.responses)
            break;
        default:
            console.log("reducer state not updated " + state.queryState.responses)
            break;
    }
    return state;
}

export default appReducer;