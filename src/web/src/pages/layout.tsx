import { FC, ReactElement } from 'react';
import Header from '../components/header';
import { Routes, Route } from 'react-router-dom';
import Constellation from './constellation';
import Login from './login';
import { Stack } from '@fluentui/react';
import { headerStackStyles, mainStackStyles, rootStackStyles } from '../ux/styles';

const Layout: FC = (): ReactElement => {
    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header></Header>
            </Stack.Item>
            <Stack.Item styles={mainStackStyles}>
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
