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
import { NoteActions } from '../state/actions/noteActions';
import * as noteActions from '../state/actions/noteActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// ux
import { loginPageStyle, loginPageLeftStyle, loginPageRightStyle, loginPageLeftTextStyle } from '../ux/pages/login';

export const Login = () => {
  const appContext = useContext<AppContext>(UserAppContext)
  const actions = useMemo(() => ({      
    user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
    constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
    cluster: bindActionCreators(clusterActions, appContext.dispatch) as unknown as ClusterActions,
    note: bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActions,
    display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
  }), [appContext.dispatch]);
  const navigate = useNavigate();
  const [googleClientId, setGoogleClientId] = useState("");
  const messages = [
    ["thinking", "is for losers"],
    ["think for yourself", "but not by yourself"],
    ["think less", "filter more"],
    ["outsource", "your thinking"]
  ]
  const messageIndex = Math.floor(Math.random() * messages.length);

  // functions
  const handleLoginSuccess = async (response: CredentialResponse) => {
    console.log('Login Success:', response);
    const userid = await actions.user.getGoogleUserId(response.credential || "");
    actions.user.setUser(true, userid);
    actions.constellation.setConstellation([]);
    actions.cluster.setClusters([]);
    actions.note.setSelectedContent(null); // if you selected on welcome screen deselect this
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
      <Stack horizontal styles={loginPageStyle}>
        <Stack.Item styles={loginPageLeftStyle}>
          <Stack.Item styles={loginPageLeftTextStyle}>
            {messages[messageIndex][0]}
          </Stack.Item>
          <Stack.Item>
            {messages[messageIndex][1]}
          </Stack.Item>
        </Stack.Item>
        <Stack.Item styles={loginPageRightStyle}>
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </GoogleOAuthProvider>
        </Stack.Item>
      </Stack>
    </GoogleOAuthProvider>
  )
};
