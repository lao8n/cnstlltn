import * as queryActions from './queryActions';

// 3 categories of data
// 1. query data
// 2. user data
// 3. display data

export enum ActionTypes {
    LOAD_TODO_LISTS = "LOAD_TODO_LISTS",
    LOAD_TODO_LIST = "LOAD_TODO_LIST",
    SELECT_TODO_LIST = "SELECT_TODO_LIST",
    SAVE_TODO_LIST = "SAVE_TODO_LIST",
    DELETE_TODO_LIST = "DELETE_TODO_LIST",
    LOAD_TODO_ITEMS = "LOAD_TODO_ITEMS",
    LOAD_TODO_ITEM = "LOAD_TODO_ITEM",
    SELECT_TODO_ITEM = "SELECT_TODO_ITEM",
    SAVE_TODO_ITEM = "SAVE_TODO_ITEM",
    DELETE_TODO_ITEM = "DELETE_TODO_ITEM",
    LOGIN_PAGE = "LOGIN_PAGE",
    LOGIN_REDIRECT_SET_USER = "LOGIN_REDIRECT_SET_USER",
    LOGIN_REDIRECT_LINK = "LOGIN_REDIRECT_LINK",
    GET_QUERY_RESPONSE_LIST = "GET_QUERY_RESPONSE_LIST",
}

export type QueryActions =
    queryActions.GetQueryResponseListAction;