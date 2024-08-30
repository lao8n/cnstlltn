// react imports
import { Dispatch } from "react";
// state imports
import { ActionTypes } from "./common";
import { UserFramework } from "../../state/userState";
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { mapUserFrameworkToDbUserFramework, mapDbUserFrameworkToUserFramework } from "../../backend/mappers";
import { ConstellationService } from "../../backend/constellationService";
import config from "../../config";

const constellationService = new ConstellationService(config.api.baseUrl); // TODO: change to note service

export interface NoteActions {
    setSelectedContent(selected: UserFramework | null): void;
    editFramework(userId: string, framework: UserFramework): Promise<UserFramework>;
    deleteFramework(userId: string, framework: UserFramework): Promise<UserFramework>;
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

export const editFramework = (userId: string, framework: UserFramework): ActionMethod<UserFramework> =>
    async (dispatch: Dispatch<EditFrameworkAction>) => {
        const dbFramework = mapUserFrameworkToDbUserFramework(userId, framework);
        const editedFrameworkDb = await constellationService.editFramework(userId, dbFramework);
        const editedFramework = mapDbUserFrameworkToUserFramework(editedFrameworkDb);
        dispatch(editFrameworkAction(editedFramework));
        return editedFramework;
    }

export interface EditFrameworkAction extends PayloadAction<string, UserFramework> {
    type: ActionTypes.EDIT_FRAMEWORK;
}

const editFrameworkAction = 
    createPayloadAction<EditFrameworkAction>(ActionTypes.EDIT_FRAMEWORK);

export const deleteFramework = (userId: string, framework: UserFramework): ActionMethod<UserFramework> =>
    async (dispatch: Dispatch<DeleteFrameworkAction>) => {
        const dbFramework = mapUserFrameworkToDbUserFramework(userId, framework);
        const deletedFrameworkDb = await constellationService.deleteFramework(userId, dbFramework);
        const deletedFramework = mapDbUserFrameworkToUserFramework(deletedFrameworkDb);
        dispatch(deleteFrameworkAction(deletedFramework));
        return deletedFramework;
    }

export interface DeleteFrameworkAction extends PayloadAction<string, UserFramework> {
    type: ActionTypes.DELETE_FRAMEWORK;
}

const deleteFrameworkAction = 
    createPayloadAction<DeleteFrameworkAction>(ActionTypes.DELETE_FRAMEWORK);