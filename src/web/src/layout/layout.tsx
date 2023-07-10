import { FC, ReactElement, useContext } from 'react';
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
import UserContext from '../components/userContext';
// import { bindActionCreators } from '../actions/actionCreators';

const Layout: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserContext)
    // const actions = useMemo(() =>
    //     query: bindActionCreators(queryCreated, dispatch)
    // }, [appContext.dispatch]);
    const onQueryCreated = async (query: string) => { 
        // await appContext.actions.queryCreated(query);
        console.log("onQueryCreated called" + query);
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
                        query={appContext.state.queryState?.query || ''}
                        onQueryCreate={onQueryCreated}/>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}

export default Layout;
