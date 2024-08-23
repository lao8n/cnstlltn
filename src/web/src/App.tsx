// react imports
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider } from '@fluentui/react';
// pages & panes imports
import RoutesLayout from './pages/routes';
import { UserAppProvider } from './panes/user';
import Telemetry from './telemetry/telemetry';
// ux imports
import './App.css';
import { CnstlltnTheme } from './ux/shared/theme';

export const App: FC = () => {
  initializeIcons();

  return (
    <ThemeProvider applyTo="body" theme={CnstlltnTheme}>
      <UserAppProvider>
        <BrowserRouter>
          <Telemetry>
            <RoutesLayout />
          </Telemetry>
        </BrowserRouter>
      </UserAppProvider>
    </ThemeProvider>
  );
};
