import { FC, ReactElement } from 'react';
import Header from '../layouts/header';
import { Routes, Route } from 'react-router-dom';
import Constellation from './constellation';
import Login from './login';
import { Stack } from '@fluentui/react';
import { routeStackStyle, layoutStackStyle } from '../ux/layouts';

const Layout: FC = (): ReactElement => {
    return (
        <Stack styles={layoutStackStyle}>
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

export default Layout;
