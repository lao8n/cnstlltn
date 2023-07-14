import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/layout';
import './App.css';
import { CnstlltnTheme } from './ux/theme';
import { UserAppProvider } from './components/user';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider } from '@fluentui/react';
import Telemetry from './components/telemetry';

export const App: FC = () => {
  initializeIcons();

  return (
    <ThemeProvider applyTo="body" theme={CnstlltnTheme}>
      <UserAppProvider>
        <BrowserRouter>
          <Telemetry>
            <Layout />
          </Telemetry>
        </BrowserRouter>
      </UserAppProvider>
    </ThemeProvider>
  );
};
