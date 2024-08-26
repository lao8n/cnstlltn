import { Dispatch } from "react";
import { ActionTypes } from "./common"
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { QueryResponse } from "../queryState";
import { ConstellationService } from "../../backend/constellationService"
import config from "../../config";
import { UserFramework } from "../userState";
import { mapUserFrameworkToDbUserFramework, mapDbUserFrameworkToUserFramework } from "../../backend/mappers";

const constellationService = new ConstellationService(config.api.baseUrl);

export interface ConstellationActions {
    saveSelectedFrameworks(userId: string, constellationName: string, frameworks: QueryResponse[]): Promise<QueryResponse[]>;
    editFramework(userId: string, framework: UserFramework): Promise<UserFramework>;
    getConstellation(userId: string, constellationName: string): Promise<UserFramework[]>;
    setConstellation(constellation: UserFramework[]): void;
    setConstellationName(constellationName: string): void;
}

export const saveSelectedFrameworks = (userId: string, constellationName: string, frameworks: QueryResponse[]): ActionMethod<QueryResponse[]> =>
    async (dispatch: Dispatch<SaveSelectedFrameworksAction>) => {
        const savedFrameworks = await constellationService.saveSelectedFrameworks(userId, constellationName, frameworks);
        dispatch(saveSelectedFrameworksAction(frameworks))
        return savedFrameworks
    }

export interface SaveSelectedFrameworksAction extends PayloadAction<string, QueryResponse[]> {
    type: ActionTypes.SAVE_SELECTED_FRAMEWORKS
}

const saveSelectedFrameworksAction =
    createPayloadAction<SaveSelectedFrameworksAction>(ActionTypes.SAVE_SELECTED_FRAMEWORKS);

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

export const getConstellation = (userId: string, constellationName: string): ActionMethod<UserFramework[]> =>
    async (dispatch: Dispatch<GetConstellationAction>) => {
        const constellationDb = await constellationService.getConstellation(userId, constellationName);
        const constellation = constellationDb.map(dbUserFramework => mapDbUserFrameworkToUserFramework(dbUserFramework));
        dispatch(getConstellationAction(constellation))
        return constellation;
    }

export interface GetConstellationAction extends PayloadAction<string, UserFramework[]> {
    type: ActionTypes.GET_CONSTELLATION
}

const getConstellationAction =
    createPayloadAction<GetConstellationAction>(ActionTypes.GET_CONSTELLATION);

export const setConstellation = (constellation: UserFramework[]) =>
    (dispatch: Dispatch<SetConstellationAction>) => {
        dispatch(setConstellationAction(constellation));
    }

export interface SetConstellationAction {
    type: ActionTypes.SET_CONSTELLATION,
    constellation: UserFramework[]
}

const setConstellationAction = (constellation: UserFramework[]): SetConstellationAction => ({
    type: ActionTypes.SET_CONSTELLATION,
    constellation: constellation,
});

export const setConstellationName = (constellationName: string) =>
    (dispatch: Dispatch<SetConstellationNameAction>) => {
        dispatch(setConstellationNameAction(constellationName));
    }

export interface SetConstellationNameAction {
    type: ActionTypes.SET_CONSTELLATION_NAME,
    constellationName: string
}

const setConstellationNameAction = (constellationName: string): SetConstellationNameAction => ({
    type: ActionTypes.SET_CONSTELLATION_NAME,
    constellationName: constellationName,
});