import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { ActionTypes } from "../actions/common";
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import UserAppContext from '../components/userContext';

const Login = () => {
  const { dispatch } = useContext(UserAppContext);
  const navigate = useNavigate();

  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    // Extract the user information or token from the response
    // Dispatch action to update user state
    dispatch({
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

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_LOGIN_CLIENT_ID || ""}>
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