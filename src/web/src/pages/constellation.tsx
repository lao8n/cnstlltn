// react imports
import { useContext } from 'react';
import { Stack } from '@fluentui/react';
// state imports
import { AppContext } from '../state/applicationState';
import { UserAppContext } from '../state/userContext';
// pane imports
import ConstellationPane from '../panes/constellationPane';
import WelcomePane from '../panes/welcomePane';
import AIPane from '../panes/aiPane';
import NotePane from '../panes/notePane';
// ux imports
import { constellationQueryPageStyle, aiPageStyle, constellationPageStyle, notePageStyle, welcomePageStyle } from '../ux/pages/constellation';

export const Constellation = () => {
  const appContext : AppContext = useContext(UserAppContext);

  if (!appContext.state.userState?.isLoggedIn) {
    return (
      <Stack horizontal styles={constellationQueryPageStyle}>
        <Stack.Item styles={welcomePageStyle}>
          <WelcomePane/>
        </Stack.Item>
        <Stack.Item styles={notePageStyle}>
          <NotePane/>
        </Stack.Item>
      </Stack>
      );
  }
  
  return (
    <Stack horizontal styles={constellationQueryPageStyle}>
      {
        // if we are not home, and we have material to show, or we have responses to show, show the ai pane
        (appContext.state.userState.constellationName !== "Home" ||
          appContext.state.browseState.material !== "" ||
          (appContext.state.queryState?.responses?.length ?? 0) > 0) && (
          <Stack.Item styles={aiPageStyle}>
            <AIPane/>
          </Stack.Item>
        )
      }
      <Stack.Item styles={constellationPageStyle}>
        <ConstellationPane/>
      </Stack.Item>
      {
        appContext.state.userState.constellationName !== "Home" && (
          <Stack.Item styles={notePageStyle}>
            <NotePane/>
          </Stack.Item>
        )
      }
    </Stack >
  );
};