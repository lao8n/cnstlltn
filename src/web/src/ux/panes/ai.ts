import { IStackStyles, mergeStyles } from "@fluentui/react";
import { CnstlltnTheme } from "../shared/theme";

const theme = CnstlltnTheme

// stacks
export const aiStackStyle: IStackStyles = {
    root: {
        width: 500,
        overflow: 'auto',
        background: theme.palette.themeLight,
        paddingRight: '5px',
        position: 'relative',
        '::after': {
            content: '""', 
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '2px', 
            backgroundColor: theme.palette.themeLight, 
        }
    }
}

export const aiButtonStackStyle = (active: boolean): IStackStyles => {
    if (active) {
        return {
            root: {
                color: theme.palette.black,
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingBottom: '15px',
                '::after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: `10px`,
                    right: `10px`,
                    bottom: '5px',
                    height: '2px',
                    backgroundColor: theme.palette.black,
                },
            }
        }
    } else {
        return {
            root: {
                paddingTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingBottom: '15px',
                '::after': {
                    left: `10px`,
                    right: `10px`,
                    display: 'none',
                    bottom: '5px',
                },
            }
        }
    }
}

// buttons
export const aiButtonStyle = mergeStyles({
    border: 'none',
    color: theme.palette.black,
    backgroundColor: theme.palette.themeLight,
    fontSize: '12px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.themeSecondary,
        color: theme.palette.white,
    }
})
