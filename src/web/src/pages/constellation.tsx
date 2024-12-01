// react imports
import { useContext, useEffect, useState } from 'react';
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
  const appContext: AppContext = useContext(UserAppContext);
  const [tabWidth, setTabWidth] = useState(document.documentElement.clientWidth);

  useEffect(() => {
    const handleResize = () => setTabWidth(document.documentElement.clientWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (tabWidth < 500 && appContext.state.userState.constellationName !== "Home") {
    return (
      <Stack horizontal styles={constellationQueryPageStyle}>
        <Stack.Item styles={aiPageStyle}>
          <AIPane/>
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