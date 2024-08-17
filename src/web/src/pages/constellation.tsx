import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import { UserAppContext } from '../state/userContext';
import { AppContext } from '../state/applicationState';
import ConstellationPane from '../layouts/constellationPane';
import { constellationQueryStackStyle } from '../ux/pages';
import WelcomePane from '../layouts/welcomePane';
import QueryPane from '../layouts/queryPane';

export const Constellation = () => {
  const appContext : AppContext = useContext(UserAppContext);

  if (!appContext.state.userState?.isLoggedIn) {
    return (
      <Stack styles={constellationQueryStackStyle}>
        <WelcomePane/>  
      </Stack>
      );
  }
  
  return (
    <Stack horizontal styles={constellationQueryStackStyle}>
      <Stack.Item>
        <ConstellationPane/>
      </Stack.Item>
      <Stack.Item>
        <QueryPane/>
      </Stack.Item>
    </Stack >
  );
};