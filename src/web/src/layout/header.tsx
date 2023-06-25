import { getTheme, IconButton, IIconProps, IStackStyles, Stack } from '@fluentui/react';
import React, { FC, ReactElement } from 'react';

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

const handleGoogleLogin = () => {
    const redirectUri = `${process.env.PUBLIC_URL}/constellation`;
    window.location.href = `/.auth/login/google?post_login_redirect_uri=${encodeURIComponent(redirectUri)}`;
}

const Header: FC = (): ReactElement => {
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
                    <IconButton aria-label="Add" iconProps={{ iconName: "Contact", ...iconProps }} onClick={handleGoogleLogin} />
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;