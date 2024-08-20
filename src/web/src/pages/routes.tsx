import { FC, ReactElement } from 'react';
import Header from '../panes/header';
import { Routes, Route } from 'react-router-dom';
import { Constellation } from './constellation';
import { Login } from './login';
import { Stack } from '@fluentui/react';
import { routePageStyle, routesLayoutPageStyle } from '../ux/pages';
import { Updates } from './updates';

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
