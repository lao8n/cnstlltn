import { createContext } from 'react';
import { AppContext, getDefaultState } from '../models/applicationState';

const initialState = getDefaultState();

export const UserContext = createContext<AppContext>({ state: initialState });
export default UserContext;