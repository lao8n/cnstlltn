import { createContext } from 'react';
import { AppContext, getDefaultState } from '../models/applicationState';

const initialState = getDefaultState();

export const UserContext = createContext<AppContext>({
    state: initialState,
    setUser: () => { throw new Error("setUser function must be overridden"); }
});

export default UserContext;