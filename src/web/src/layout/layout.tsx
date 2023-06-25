import { FC, ReactElement } from 'react';
import Header from './header';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Constellation from '../pages/constellation';
import { Stack } from '@fluentui/react';
import { headerStackStyles, mainStackStyles, rootStackStyles } from '../ux/styles';

const Layout: FC = (): ReactElement => {

    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header></Header>
            </Stack.Item>
            <Stack horizontal grow={1}>
                <Stack.Item grow={1} styles={mainStackStyles}>
                    <Routes>
                        <Route path="/constellation" element={<Constellation />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}

export default Layout;
