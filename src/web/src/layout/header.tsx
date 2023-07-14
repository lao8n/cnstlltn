import { IconButton, IIconProps, IStackStyles, Stack } from '@fluentui/react';
import { FC, useContext, useEffect, useState, ReactElement, Dispatch } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';
import { UserAppContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';
import { useNavigate } from 'react-router-dom';
import { CnstlltnTheme } from '../ux/theme';
import { ActionTypes } from '../actions/common';
import { SetUserAction } from '../actions/userActions';

const theme = CnstlltnTheme

const logoStyles: IStackStyles = {
    root: {
        width: '300px',
        alignItems: 'center',
        padding: '0 20px'
    }
}

const toolStackClass: IStackStyles = {
    root: {
        alignItems: 'center',
        height: 48,
        paddingRight: 10
    }
}

const iconProps: IIconProps = {
    styles: {
        root: {
            fontSize: 16,
            color: theme.palette.white
        }
    }
}

const handleLogin = (navigate : NavigateFunction) => {
    console.log("handleLogin called");
   navigate('/login');
}

const handleLogout = (navigate : NavigateFunction, dispatch : Dispatch<SetUserAction>) => {
    console.log("handleLogout called");
    dispatch({
        type: ActionTypes.SET_USER,
        payload: {
            isLoggedIn: false,
        },
    });
    navigate(`/auth/logout?post_logout_redirect_uri=${window.location.origin}`);
}

const Header: FC = (): ReactElement => {
    const { state, dispatch }: AppContext = useContext(UserAppContext);
    const navigate = useNavigate();
    const [logInOrOut, setLogInOrOut] = useState<() => void>(() => () => handleLogin(navigate));
    const [signInOrOut, setSignInOrOut] = useState(() => "Signin");
    useEffect(() => {
        if(state.userState?.isLoggedIn){
            setLogInOrOut(() => () => handleLogout(navigate, dispatch));
            setSignInOrOut(() => "SignOut");
        } else {
            setLogInOrOut(() => () => handleLogin(navigate));
            setSignInOrOut(() => "Signin");
        }
    }, [state, dispatch, navigate]);

    return (
        <Stack horizontal>
            <Stack horizontal styles={logoStyles}>
                <Link to="/constellation">
                    <img src={`${process.env.PUBLIC_URL}/cnstlltn_logo.png`} alt="Logo" style={{width: '100px', height: 'auto'}}/>
                </Link>
            </Stack>
            <Stack.Item grow={1}>
                <div></div>
            </Stack.Item>
            <Stack.Item>
                <Stack horizontal styles={toolStackClass} grow={1}>
                    <IconButton aria-label="Add" iconProps={{ iconName: signInOrOut, ...iconProps }} onClick={logInOrOut} />
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;