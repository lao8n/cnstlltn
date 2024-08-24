// react imports
import { FC, ReactElement } from 'react';
import { Stack } from '@fluentui/react';
import { Routes, Route } from 'react-router-dom';
// page & pane imports
import { Constellation } from './constellation';
import { Login } from './login';
import { Updates } from './updates';
import Header from '../panes/headerPane';
// ux imports
import { routePageStyle, routesLayoutPageStyle } from '../ux/pages/routes';

const RoutesLayout: FC = (): ReactElement => {
    return (
        <Stack styles={routesLayoutPageStyle}>
            <Stack.Item>
                <Header></Header>
            </Stack.Item>
            <Stack.Item styles={routePageStyle}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/constellation" element={<Constellation/>}/>
                    <Route path="/" element={<Constellation/>}/>
                    <Route path="/updates" element={<Updates/>}/>
                </Routes>
            </Stack.Item>
        </Stack>
    );
}

export default RoutesLayout;
