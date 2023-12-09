import { Reducer } from "react";
import { ActionTypes, ApplicationActions } from "../actions/common";
import { ApplicationState } from "../models/applicationState";

export const appReducer: Reducer<ApplicationState, ApplicationActions> = (state: ApplicationState, action: ApplicationActions): ApplicationState => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            state.userState = { ...state.userState, isLoggedIn: action.isLoggedIn, userId: action.userId };
            break;
        case ActionTypes.GET_CONSTELLATION:
            state.userState.constellation = action.payload;
            break;
        case ActionTypes.POST_QUERY_RESPONSE_LIST:
            state.queryState.responses = action.payload;
            state.queryState.responses?.forEach((response) => {
                console.log("response title ", response.title + " content " + response.content)
            })
            break;
        case ActionTypes.SET_CONSTELLATION:
            state.userState.constellation = action.constellation;
            break;
        case ActionTypes.SAVE_SELECTED_FRAMEWORKS:
            break;
        default:
            console.log("reducer state not updated")
            break;
    }
    return { ...state};
}

export default appReducer;