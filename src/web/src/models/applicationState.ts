import { UserState } from "../models/userState";
import { Dispatch, SetStateAction } from "react";

export interface AppContext {
    state: ApplicationState
    setUser: Dispatch<SetStateAction<UserState | undefined>>;
}

export interface ApplicationState {
    userState?: UserState,
}

export const getDefaultState = (): ApplicationState => {
    return {
        userState: undefined
    }
}
