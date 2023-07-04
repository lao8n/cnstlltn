import { useContext } from 'react';
import { Stack, Text } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { UserContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';

const Constellation = () => {
    const user : AppContext = useContext(UserContext);

    if(!user.state.userState?.isAuthenticated){
      return (
        <Stack>
          <Text>Login to access constellation</Text>
        </Stack>
      );
    }
  
    return (
      <Stack>
        <Text>Welcome {user.state.userState.userId}</Text>
      </Stack >
    );
  };
  
  export default withApplicationInsights(Constellation, 'Constellation');