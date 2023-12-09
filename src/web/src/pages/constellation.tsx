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
        <Text>Welcome</Text>

        {appContext.state.queryState.responses && appContext.state.queryState.responses.map((response, index) => (
            <div key={index}>
                <Text><strong>Title:</strong> {response.title}</Text>
                <Text><strong>Content:</strong> {response.content}</Text>
            </div>
        ))}
        <ConstellationPane
          constellation={appContext.state.userState.constellation} />
      </Stack >
    );
  };
  
  export default withApplicationInsights(Constellation, 'Constellation');