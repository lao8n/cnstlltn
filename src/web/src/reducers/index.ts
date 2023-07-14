import { Reducer } from "react";
import { ApplicationActions } from "../actions/common";
import { queryReducer } from "./queryReducer";
import { userReducer } from "./userReducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combineReducers = (slices: {[key: string]: Reducer<any, ApplicationActions>}) => (prevState: any, action: ApplicationActions) =>
    Object.keys(slices).reduce(
        (nextState, nextProp) => ({
            ...nextState,
            [nextProp]: slices[nextProp](prevState[nextProp], action)
        }),
        prevState
    );

export default combineReducers({
    queryResponses: queryReducer,
    user: userReducer,
});
