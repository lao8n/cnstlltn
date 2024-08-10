// react imports
import { FC, useContext, useEffect, useState, ReactElement, useMemo, useCallback } from 'react';
import { IconButton, Stack } from '@fluentui/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// ux imports
import { headerLogoStyles, headerToolStackClass, headerIconProps } from '../ux/styles';

// state imports
import { UserAppContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';
import { bindActionCreators } from '../actions/actionCreators';
import { UserActions } from '../actions/userActions';
import * as userActions from '../actions/userActions';
import { ConstellationActions } from '../actions/constellationActions';
import * as constellationActions from '../actions/constellationActions';

const Header: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
    }), [appContext.dispatch]);
    const navigate = useNavigate();
    const [logInOrOut, setLogInOrOut] = useState<() => void>(() => () => handleLogin(navigate));
    const [signInOrOut, setSignInOrOut] = useState(() => "Signin");

    // functions
    const handleClick = () => {
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
                <Link to="/constellation" onClick={handleClick}>
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