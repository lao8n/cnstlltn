import { Dispatch } from "react";
import { ActionTypes } from "./common"

export interface DisplayActions {
    setUpdated(updated: number): void;
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