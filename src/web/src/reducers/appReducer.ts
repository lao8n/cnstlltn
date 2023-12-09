import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "../actions/common";
import { ApplicationState } from "../models/applicationState";

export const appReducer: Reducer<ApplicationState, ApplicationActions> = (state: ApplicationState, action: ApplicationActions): ApplicationState => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            state = { ...state, userState: { isLoggedIn: action.isLoggedIn, constellation: state.userState.constellation } };
            break;
        case ActionTypes.GET_CONSTELLATION:
            state = { ...state, userState: { isLoggedIn: state.userState.isLoggedIn, constellation: action.payload } };
            break;
        case ActionTypes.POST_QUERY_RESPONSE_LIST:
            state = { ...state, queryState: { responses: action.payload } };
            state.queryState.responses?.forEach((response) => {
                console.log("response title ", response.title + " content " + response.content)
            })
            break;
        case ActionTypes.SET_CONSTELLATION:
            state = { ...state, userState: { isLoggedIn: state.userState.isLoggedIn, constellation: action.constellation } };
            break;
        default:
            console.log("reducer state not updated", action.type)
            break;
    }
    return state;
}

export default appReducer;