// react imports
import { Dispatch } from "react";
// state imports
import { ActionTypes } from "./common";
import { UserFramework } from "../../state/userState";

export interface NoteActions {
    setSelectedContent(selected: UserFramework | null): void;
}

export const setSelectedContent = (selected: UserFramework | null) => 
    (dispatch: Dispatch<SetSelectedContentAction>) => {
        dispatch(setSelectedContentAction(selected));
    }

export interface SetSelectedContentAction {
    type: ActionTypes.SET_SELECTED_CONTENT,
    selected: UserFramework | null,
}

const setSelectedContentAction = (selected: UserFramework | null): SetSelectedContentAction => ({
    type: ActionTypes.SET_SELECTED_CONTENT,
    selected: selected,
});