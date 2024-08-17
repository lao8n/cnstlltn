import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../telemetry/telemetry';
import { UserAppContext } from '../state/userContext';
import { AppContext } from '../state/applicationState';
import ConstellationPane from '../layouts/constellationPane';
import { constellationQueryStackStyle } from '../ux/layouts';
import WelcomePane from '../layouts/welcomePane';
import QueryPane from '../layouts/queryPane';

const Constellation = () => {
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
      <ConstellationPane/>
      <QueryPane/>
    </Stack >
  );
};
  
export default withApplicationInsights(Constellation, 'Constellation');