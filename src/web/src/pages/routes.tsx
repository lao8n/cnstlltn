import { FC, ReactElement } from 'react';
import Header from '../layouts/header';
import { Routes, Route } from 'react-router-dom';
import { Constellation } from './constellation';
import { Login } from './login';
import { Stack } from '@fluentui/react';
import { routeStackStyle, routesLayoutStackStyle } from '../ux/pages';

const RoutesLayout: FC = (): ReactElement => {
    return (
        <Stack styles={routesLayoutStackStyle}>
            <Stack.Item>
                <Header></Header>
            </Stack.Item>
            <Stack.Item styles={routeStackStyle}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/constellation" element={<Constellation/> } />
                    <Route path="/" element={<Constellation/>} />
                </Routes>
            </Stack.Item>
        </Stack>
    );
}

export default RoutesLayout;
