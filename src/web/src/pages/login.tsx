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
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { ClusterActions } from '../state/actions/clusterActions';
import * as clusterActions from '../state/actions/clusterActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// ux
import { loginPageStyle } from '../ux/pages';

export const Login = () => {
  const appContext = useContext<AppContext>(UserAppContext)
  const actions = useMemo(() => ({      
    user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
    constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
    cluster: bindActionCreators(clusterActions, appContext.dispatch) as unknown as ClusterActions,
    display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
  }), [appContext.dispatch]);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");

  // functions
  const handleLoginSuccess = (response: CredentialResponse) => {
    console.log('Login Success:', response);
    actions.user.setUser(true, response.clientId || "");
    actions.constellation.setConstellation([]);
    actions.cluster.setClusters([]);
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
    <GoogleOAuthProvider clientId={googleClientId}>
      <Stack styles={loginPageStyle}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </GoogleOAuthProvider>
      </Stack>
    </GoogleOAuthProvider>
  )
};
