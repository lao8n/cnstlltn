import { UserState } from "./userState";
import { QueryResponses } from "./queryState";
import { BrowseState } from "./browseState";
import { FrameResponses } from "./frameState";
import { Dispatch } from "react";
import { ApplicationActions } from "./actions/common";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<ApplicationActions>;
}

export interface ApplicationState {
    userState: UserState,
    queryState: QueryResponses,
    frameState: FrameResponses,
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
            responses: []
        },
        browseState: {
            material: "",
            messages: [],
        },
        frameState: {   
            responses: [],
        },
    }
}
