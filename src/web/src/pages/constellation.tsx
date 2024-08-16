import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../telemetry/telemetry';
import { UserAppContext } from '../state/userContext';
import { AppContext } from '../state/applicationState';
import ConstellationPane from '../components/constellationPane';
import { constellationQueryStackStyle } from '../ux/styles';
import WelcomePane from '../components/welcomePane';
import QueryPane from '../components/queryPane';

const Constellation = () => {
  const appContext : AppContext = useContext(UserAppContext);

  if (!appContext.state.userState?.isLoggedIn) {
    return (
      <WelcomePane/>
      );
  }
  
  // myabe need to add grow{1} below here
  return (
    <Stack horizontal styles={constellationQueryStackStyle}>
      <ConstellationPane />
      <QueryPane/>
    </Stack >
  );
};
  
export default withApplicationInsights(Constellation, 'Constellation');