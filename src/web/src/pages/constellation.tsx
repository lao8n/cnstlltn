import { useContext } from 'react';
import { Stack, Text } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { UserAppContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';
import ConstellationPane from '../components/constellationPane';

const Constellation = () => {
    const appContext : AppContext = useContext(UserAppContext);

    if(!appContext.state.userState?.isLoggedIn){
      return (
        <Stack>
          <Text>Login to access constellation</Text>
        </Stack>
      );
    }
  
    return (
      <Stack>
        <ConstellationPane
          constellation={appContext.state.userState.constellation}
          cluster={appContext.state.userState.cluster} />
      </Stack >
    );
  };
  
  export default withApplicationInsights(Constellation, 'Constellation');