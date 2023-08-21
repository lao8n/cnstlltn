import { FC, ReactElement, useContext, useMemo } from 'react';
import Header from './header';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Constellation from '../pages/constellation';
import Login from '../pages/login';
import { AppContext } from '../models/applicationState';
import { Stack } from '@fluentui/react';
import { headerStackStyles, mainStackStyles, rootStackStyles, sidebarStackStyles } from '../ux/styles';
import { LoginRedirect } from '../pages/loginRedirect';
import Sidebar from './sidebar';
import * as queryActions from '../actions/queryActions';
import UserAppContext from '../components/userContext';
import { bindActionCreators } from '../actions/actionCreators';
import { QueryActions } from '../actions/queryActions';
import { Query } from '../models/queryState';

const Layout: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        queryResponseList: bindActionCreators(queryActions, appContext.dispatch) as unknown as QueryActions
    }), [appContext.dispatch]);

    // do not need to load initial query?

    const onQueryCreated = async (query: Query) => { 
        console.log("onQueryCreated called " + query.userTxt)
        const queryResponseList = await actions.queryResponseList.postQueryResponseList(query);
        console.log("query response returned " + queryResponseList);
        // appContext.dispatch({ type: ActionTypes.POST_QUERY_RESPONSE_LIST, payload: queryResponseList });
    }

    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header></Header>
            </Stack.Item>
            <Stack horizontal grow={1}>
                <Stack.Item grow={1} styles={mainStackStyles}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/login-redirect" element={<LoginRedirect />} />
                        <Route path="/constellation" element={<Constellation />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Stack.Item>
                <Stack.Item styles={sidebarStackStyles}>
                    <Sidebar
                        query={appContext.state.queryState.query}
                        onQueryCreate={onQueryCreated}/>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}

export default Layout;
