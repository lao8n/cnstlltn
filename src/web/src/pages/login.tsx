import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { ActionTypes } from "../actions/common";
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import UserAppContext from '../components/userContext';
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { AppContext } from "../models/applicationState";
import { UserActions } from '../actions/userActions';

const Login = () => {
  const appContext = useContext<AppContext>(UserAppContext)
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

  const actions = useMemo(() => ({      
    login: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
}), [appContext.dispatch]);

  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    // Extract the user information or token from the response
    // Dispatch action to update user state
    appContext.dispatch({
      type: ActionTypes.SET_USER,
      isLoggedIn: true,
      userId: response.clientId || "", // Update based on actual response structure
    });
    // Redirect to another page if needed
    navigate('/constellation');
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  useEffect(() => {
    const fetchGoogleClientId = async () => {
      const loginConfig = await actions.login.getLoginConfig()
      setGoogleClientId(loginConfig.googleClientId);
    };
    fetchGoogleClientId();
  });

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