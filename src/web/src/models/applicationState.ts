import { UserState } from "../models/userState";
import { QueryState } from "../models/queryState";
import { Dispatch, SetStateAction } from "react";

export interface AppContext {
    state: ApplicationState
    setUser: Dispatch<SetStateAction<UserState | undefined>>;
}

export interface ApplicationState {
    userState?: UserState,
    queryState?: QueryState
}

export const getDefaultState = (): ApplicationState => {
    return {
        userState: undefined,
        queryState: {query: ''},
    }
}
