import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import { UserAppContext } from '../state/userContext';
import { AppContext } from '../state/applicationState';
import ConstellationPane from '../panes/constellationPane';
import { constellationQueryPageStyle, queryPageStyle } from '../ux/pages';
import WelcomePane from '../panes/welcomePane';
import QueryPane from '../panes/queryPane';
import { constellationStackStyle } from '../ux/constellation';

export const Constellation = () => {
  const appContext : AppContext = useContext(UserAppContext);

  if (!appContext.state.userState?.isLoggedIn) {
    return (
      <Stack styles={constellationQueryPageStyle}>
        <WelcomePane/>  
      </Stack>
      );
  }
  
  return (
    <Stack horizontal styles={constellationQueryPageStyle}>
      <Stack.Item styles={constellationStackStyle}>
        <ConstellationPane/>
      </Stack.Item>
      <Stack.Item styles={queryPageStyle}>
        <QueryPane/>
      </Stack.Item>
    </Stack >
  );
};