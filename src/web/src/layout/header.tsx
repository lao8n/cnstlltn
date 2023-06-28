import { getTheme, IconButton, IIconProps, IStackStyles, Stack } from '@fluentui/react';
import { FC, useContext, useEffect, useState, ReactElement } from 'react';
import { UserContext } from '../components/userContext';
import { AppContext } from '../models/applicationState';

const theme = getTheme();

const logoStyles: IStackStyles = {
    root: {
        width: '300px',
        background: theme.palette.themePrimary,
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

const handleLogin = () => {
    console.log("handleLogin called");
   window.location.href = `/login`;
}

const handleLogout = () => {
    console.log("handleLogout called");
    window.location.href = `/auth/logout?post_login_redirect_uri=${encodeURIComponent('/constellation')}`;
}

const Header: FC = (): ReactElement => {
    const user : AppContext = useContext(UserContext);
    const [logInOrOut, setLogInOrOut] = useState(() => handleLogin);
    const [signInOrOut, setSignInOrOut] = useState(() => "Signin");
    useEffect(() => {
        if(user.state.userState?.isAuthenticated){
            setLogInOrOut(() => handleLogout);
            setSignInOrOut(() => "SignOut");
        } else {
            setLogInOrOut(() => handleLogin);
            setSignInOrOut(() => "Signin");
        }
    }, [user, UserContext]);

    return (
        <Stack horizontal>
            <Stack horizontal styles={logoStyles}>
                <img src={`${process.env.PUBLIC_URL}/cnstlltn_logo.png`} alt="Logo" style={{width: '100px', height: 'auto'}}/>
            </Stack>
            <Stack.Item grow={1}>
                <div></div>
            </Stack.Item>
            <Stack.Item>
                <Stack horizontal styles={toolStackClass} grow={1}>
                    <IconButton aria-label="Add" iconProps={{ iconName: "Settings", ...iconProps }} />
                    <IconButton aria-label="Add" iconProps={{ iconName: "Help", ...iconProps }} />
                    <IconButton aria-label="Add" iconProps={{ iconName: signInOrOut, ...iconProps }} onClick={logInOrOut} />
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;