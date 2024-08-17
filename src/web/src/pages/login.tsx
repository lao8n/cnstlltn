// react imports
import { Stack } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useMemo } from 'react';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
// user state imports
import { AppContext } from "../state/applicationState";
import UserAppContext from '../state/userContext';
import { bindActionCreators } from "../state/actions/actionCreators";
import { UserActions } from '../state/actions/userActions';
import * as userActions from '../state/actions/userActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// telemetry imports
import { withApplicationInsights } from '../telemetry/telemetry';
// ux
import { loginStackStyle } from '../ux/pages';

const Login = () => {
  const appContext = useContext<AppContext>(UserAppContext)
  const actions = useMemo(() => ({      
    user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
    display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
  }), [appContext.dispatch]);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

  // functions
  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    actions.user.setUser(true, response.clientId || "");
    actions.display.setSelectedContent(null); // if you selected on welcome screen deselect this
    navigate('/constellation');
  };
  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  // effects
  useEffect(() => {
    console.log("fetch google client id")
    const fetchGoogleClientId = async () => {
      const loginConfig = await actions.user.getLoginConfig()
      setGoogleClientId(loginConfig.googleClientId);
    };
    fetchGoogleClientId();
  }, [actions.user]);

  return (
    <Stack styles={loginStackStyle}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
    </GoogleOAuthProvider>
    </Stack>
  );
};

export default withApplicationInsights(Login, 'Login');