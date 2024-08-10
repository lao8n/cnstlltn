// react imports
import { Stack } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useMemo } from 'react';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
// user state imports
import { AppContext } from "../models/applicationState";
import UserAppContext from '../components/userContext';
import { bindActionCreators } from "../actions/actionCreators";
import { UserActions } from '../actions/userActions';
import * as userActions from '../actions/userActions';
// telemetry imports
import { withApplicationInsights } from '../components/telemetry';

const Login = () => {
  const appContext = useContext<AppContext>(UserAppContext)
  const actions = useMemo(() => ({      
    user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
  }), [appContext.dispatch]);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

  // functions
  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    actions.user.setUser(true, response.clientId || "")
    navigate('/constellation');
  };
  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  // effects
  useEffect(() => {
    const fetchGoogleClientId = async () => {
      const loginConfig = await actions.user.getLoginConfig()
      setGoogleClientId(loginConfig.googleClientId);
    };
    fetchGoogleClientId();
  }, [actions.user]);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Stack verticalAlign="center" horizontalAlign="center">
        <Stack.Item> Login into cnstlltn </Stack.Item>
        <Stack.Item>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </Stack>
        </Stack.Item>
      </Stack>
    </GoogleOAuthProvider>
  );
};

export default withApplicationInsights(Login, 'Login');