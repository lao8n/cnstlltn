import { useContext } from 'react';
import { Stack, Text } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { UserAppContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';
import ConstellationPane from '../components/constellationPane';
import { canvasStackStyle } from '../ux/styles';

const Constellation = () => {
    const appContext : AppContext = useContext(UserAppContext);

  if (!appContext.state.userState?.isLoggedIn) {
    return (
      <Stack grow={1}>
          <Text>Login to access constellation</Text>
        </Stack>
      );
    }
  
    return (
      <Stack grow={1} styles={canvasStackStyle}>
        <ConstellationPane/>
      </Stack >
    );
  };
  
  export default withApplicationInsights(Constellation, 'Constellation');