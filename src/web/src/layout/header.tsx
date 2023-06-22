import { getTheme, IconButton, IIconProps, IStackStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import { FC, ReactElement } from 'react';

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
                    <Persona size={PersonaSize.size24} text="Sample User" />
                    {/* <Toggle label="Dark Mode" inlineLabel styles={{ root: { marginBottom: 0 } }} onChange={changeTheme} /> */}
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;