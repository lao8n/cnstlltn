import { useContext } from 'react';
import { Stack, Text } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { UserAppContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';

const Constellation = () => {
    const user : AppContext = useContext(UserAppContext);

    if(!user.state.userState?.isLoggedIn){
      return (
        <Stack>
          <Text>Login to access constellation</Text>
        </Stack>
      );
    }
  
    return (
      <Stack>
        <Text>Welcome</Text>
      </Stack >
    );
  };
  
  export default withApplicationInsights(Constellation, 'Constellation');