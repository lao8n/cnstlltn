import { createContext } from 'react';
import { AppContext, getDefaultState } from '../models/applicationState';

const initialState = getDefaultState();
const dispatch = () => { return };
export const UserContext = createContext<AppContext>({
    state: initialState,
    setUser: () => { throw new Error("setUser function must be overridden"); },
    dispatch: dispatch
});

export default UserContext;