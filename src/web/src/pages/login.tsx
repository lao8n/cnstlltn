import { Stack } from '@fluentui/react';
import { withApplicationInsights } from '../components/telemetry';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { ActionTypes } from "../actions/common";
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import UserAppContext from '../components/userContext';

const Login = () => {
  const { dispatch } = useContext(UserAppContext);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

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

  useEffect(() => {
    fetch("/login-config")
        .then(response => response.json())
        .then(data => {
            setGoogleClientId(data.googleClientId);
        })
        .catch(error => console.error("Failed to load Google login config:", error));
  }, []);


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