// react imports
import { useContext } from 'react';
import { Stack } from '@fluentui/react';
// state imports
import { AppContext } from '../state/applicationState';
import { UserAppContext } from '../state/userContext';
// pane imports
import ConstellationPane from '../panes/constellationPane';
import WelcomePane from '../panes/welcomePane';
import QueryPane from '../panes/queryPane';
// ux imports
import { constellationQueryPageStyle, queryPageStyle, constellationStackStyle } from '../ux/pages/constellation';

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