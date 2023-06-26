import { UserState } from "../models/userState";

export interface AppContext {
    state: ApplicationState
}

export interface ApplicationState {
    userState?: UserState,
}

export const getDefaultState = (): ApplicationState => {
    return {
        userState: undefined
    }
}
