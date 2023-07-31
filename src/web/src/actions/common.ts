import * as queryActions from './queryActions';
import * as userActions from './userActions';

// 3 categories of data
// 1. query data
// 2. user data
// 3. display data

export enum ActionTypes {
    SET_USER = "SET_USER",
    POST_QUERY_RESPONSE_LIST = "POST_QUERY_RESPONSE_LIST",
}

export type ApplicationActions =
    queryActions.PostQueryResponseListAction |
    userActions.SetUserAction;