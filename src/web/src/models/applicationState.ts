import { UserState } from "../models/userState";
import { QueryState } from "../models/queryState";
import { Dispatch } from "react";
import { ApplicationActions } from "../actions/common";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<ApplicationActions>;
}

export interface ApplicationState {
    userState: UserState,
    queryState: QueryState
}

export const getDefaultState = (): ApplicationState => {
    return {
        userState: {isLoggedIn: false},
        queryState: {query: undefined, responses: undefined},
    }
}
