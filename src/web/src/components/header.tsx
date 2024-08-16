// react imports
import { FC, useContext, useEffect, useState, ReactElement, useMemo, useCallback } from 'react';
import { IconButton, Stack } from '@fluentui/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// ux imports
import { headerLogoStyles, headerToolStackClass, headerIconProps } from '../ux/components';

// state imports
import { UserAppContext } from '../state/userContext';
import { AppContext } from '../state/applicationState';
import { bindActionCreators } from '../state/actions/actionCreators';
import { UserActions } from '../state/actions/userActions';
import * as userActions from '../state/actions/userActions';
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { ClusterActions } from '../state/actions/clusterActions';
import * as clusterActions from '../state/actions/clusterActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';

const Header: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        cluster: bindActionCreators(clusterActions, appContext.dispatch) as unknown as ClusterActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);
    const navigate = useNavigate();
    const [logInOrOut, setLogInOrOut] = useState<() => void>(() => () => handleLogin(navigate));
    const [signInOrOut, setSignInOrOut] = useState(() => "Signin");

    // functions
    const handleReturnToHome = () => {
        actions.cluster.setClusterBy('');
        actions.display.setSelectedContent(null);
        actions.constellation.setConstellationName("Home");
    }
    const handleLogin = useCallback((navigate) => {
        console.log("handleLogin called");
        navigate('/login');
    }, []); 

    const handleLogout = useCallback((navigate) => {
        console.log("handleLogout called");
        actions.user.setUser(false, "");
        navigate(`/auth/logout?post_logout_redirect_uri=${window.location.origin}`);
    }, [actions.user]);

    // effects
    useEffect(() => {
        console.log("login or out")
        if(appContext.state.userState?.isLoggedIn){
            setLogInOrOut(() => () => handleLogout(navigate));
            setSignInOrOut(() => "SignOut");
        } else {
            setLogInOrOut(() => () => handleLogin(navigate));
            setSignInOrOut(() => "Signin");
        }
    }, [appContext.state.userState?.isLoggedIn, actions.user, handleLogin, handleLogout, navigate]);

    return (
        <Stack horizontal>
            <Stack horizontal styles={headerLogoStyles}>
                <Link to="/constellation" onClick={handleReturnToHome}>
                    <img src={`${process.env.PUBLIC_URL}/cnstlltn_logo.png`} alt="Logo" style={{width: '100px', height: 'auto'}}/>
                </Link>
            </Stack>
            <Stack.Item grow={1}>
                <div></div>
            </Stack.Item>
            <Stack.Item>
                <Stack horizontal styles={headerToolStackClass} grow={1}>
                    <IconButton aria-label="Add" iconProps={{ iconName: signInOrOut, ...headerIconProps }} onClick={logInOrOut} />
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;