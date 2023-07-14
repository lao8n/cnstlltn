import { createContext } from 'react';
import { AppContext, getDefaultState } from '../models/applicationState';

const initialState = getDefaultState();
const dispatch = () => { return };
export const UserAppContext = createContext<AppContext>({
    state: initialState,
    dispatch: dispatch
});

export default UserAppContext;