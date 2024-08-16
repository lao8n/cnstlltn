import { Dispatch } from "react";
import { ActionTypes } from "./common"
import { DisplayPoint } from "../../frontend/models";

export interface DisplayActions {
    setUpdated(updated: number): void;
    setSelectedContent(selected: DisplayPoint | null): void;
}

export const setUpdated = (updated: number) => 
    (dispatch: Dispatch<SetUpdatedAction>) => {
        dispatch(setUpdatedAction(updated));
    }

export interface SetUpdatedAction {
    type: ActionTypes.SET_UPDATED,
    updated: number,
}

const setUpdatedAction = (updated: number): SetUpdatedAction => ({
    type: ActionTypes.SET_UPDATED,
    updated: updated,
});

export const setSelectedContent = (selected: DisplayPoint | null) => 
    (dispatch: Dispatch<SetSelectedContentAction>) => {
        dispatch(setSelectedContentAction(selected));
    }

export interface SetSelectedContentAction {
    type: ActionTypes.SET_SELECTED_CONTENT,
    selected: DisplayPoint | null,
}

const setSelectedContentAction = (selected: DisplayPoint | null): SetSelectedContentAction => ({
    type: ActionTypes.SET_SELECTED_CONTENT,
    selected: selected,
});