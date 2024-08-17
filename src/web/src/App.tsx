import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesLayout from './pages/routes';
import './App.css';
import { CnstlltnTheme } from './ux/theme';
import { UserAppProvider } from './layouts/user';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider } from '@fluentui/react';
import Telemetry from './telemetry/telemetry';

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
