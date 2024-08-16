import { useContext } from 'react';
import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../telemetry/telemetry';
import { UserAppContext } from '../state/userContext';
import { AppContext } from '../state/applicationState';
import ConstellationPane from '../components/constellationPane';
import { canvasStackStyle, sidebarStackStyles } from '../ux/styles';
import WelcomePane from '../components/welcomePane';
import QueryPane from '../components/queryPane';

const Constellation = () => {
    const appContext : AppContext = useContext(UserAppContext);

  if (!appContext.state.userState?.isLoggedIn) {
    return (
      <Stack>
        <WelcomePane/>
      </Stack>
      );
    }
  
    return (
      <Stack horizontal grow={1} styles={canvasStackStyle}>
        <ConstellationPane />
        <Stack.Item grow={1} styles={sidebarStackStyles}>
            <QueryPane/>
        </Stack.Item>
      </Stack >
    );
  };
  
  export default withApplicationInsights(Constellation, 'Constellation');