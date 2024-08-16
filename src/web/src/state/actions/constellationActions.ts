import { Dispatch } from "react";
import { ActionTypes } from "./common"
import { ActionMethod, PayloadAction, createPayloadAction } from "./actionCreators";
import { QueryResponse } from "../queryState";
import { ConstellationService } from "../../backend/constellationService"
import config from "../../config";
import { DbUserFramework } from "../../backend/models";

const constellationService = new ConstellationService(config.api.baseUrl);

export interface ConstellationActions {
    saveSelectedFrameworks(userId: string, constellationName: string, frameworks: QueryResponse[]): Promise<QueryResponse[]>;
    getConstellation(userId: string, constellationName: string): Promise<DbUserFramework[]>;
    setConstellation(constellation: DbUserFramework[]): void;
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

export const getConstellation = (userId: string, constellationName: string): ActionMethod<DbUserFramework[]> =>
    async (dispatch: Dispatch<GetConstellationAction>) => {
        const constellation = await constellationService.getConstellation(userId, constellationName);
        dispatch(getConstellationAction(constellation))
        return constellation;
    }

export interface GetConstellationAction extends PayloadAction<string, DbUserFramework[]> {
    type: ActionTypes.GET_CONSTELLATION
}

const getConstellationAction =
    createPayloadAction<GetConstellationAction>(ActionTypes.GET_CONSTELLATION);

export const setConstellation = (constellation: DbUserFramework[]) =>
    (dispatch: Dispatch<SetConstellationAction>) => {
        dispatch(setConstellationAction(constellation));
    }

export interface SetConstellationAction {
    type: ActionTypes.SET_CONSTELLATION,
    constellation: DbUserFramework[]
}

const setConstellationAction = (constellation: DbUserFramework[]): SetConstellationAction => ({
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