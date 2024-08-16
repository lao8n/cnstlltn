import { FC, PropsWithChildren, ReactElement, useReducer } from 'react';
import UserAppContext from './userContext';
import { AppContext, ApplicationState, getDefaultState } from '../state/applicationState';
import appReducer from '../state/appReducer';

type AppProps = PropsWithChildren<unknown>;

export const UserAppProvider: FC<AppProps> = (props: AppProps): ReactElement => {
    const defaultState: ApplicationState = getDefaultState();
    const [applicationState, dispatch] = useReducer(appReducer, defaultState)
    const initialContext: AppContext = { state: applicationState, dispatch: dispatch }

    return (
        <UserAppContext.Provider value={ initialContext }>
            {props.children}
        </UserAppContext.Provider>
    );
}
export default UserAppProvider