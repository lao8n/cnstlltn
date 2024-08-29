import { UserState } from "./userState";
import { QueryState, BrowseState } from "./queryState";
import { Dispatch } from "react";
import { ApplicationActions } from "./actions/common";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<ApplicationActions>;
}

export interface ApplicationState {
    userState: UserState,
    queryState: QueryState,
    browseState: BrowseState,
}

export const getDefaultState = (): ApplicationState => {
    return {
        userState: {
            isLoggedIn: false,
            userId: "",
            constellationName: "Home",
            constellation: [],
            clusterBy: "",
            clusters: [],
            updated: Date.now(),
            selectedContent: null,
        },
        queryState: {
            query: undefined, responses: undefined
        },
        browseState: {
            material: "",
            messages: [],
        }
    }
}
