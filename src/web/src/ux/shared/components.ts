import { IStackStyles, IStackItemTokens, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme';

const theme = CnstlltnTheme;

// canvas
export const canvasStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const canvasStyle = {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
};

// buttons
export const buttonStyles = mergeStyles({
    backgroundColor: theme.palette.themeLight,
    color: theme.palette.black,
    cursor: 'pointer',
    padding: '5px 10px',
    border: 'none',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.themeSecondary,
        color: theme.palette.white,
    }
});

export const selectedButtonStyles = mergeStyles(buttonStyles, {
    backgroundColor: theme.palette.themePrimary,
    color: theme.palette.white,
});

export const saveSelectedButtonStyle = mergeStyles({
    width: '100%',
    border: 'none',
    fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
    paddingTop: '5px',
    paddingBottom: '5px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.themeSecondary,
        color: theme.palette.white,
    }
});

// text
export const badInputNotifications: IStackStyles = {
    root: {
        padding: 10,
        color: theme.palette.black
    }
}

export const queryFieldStyles = {
    field: {
        color: theme.palette.black,
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        paddingLeft: 0,
        '::placeholder': {
            color: theme.palette.black,
            opacity: 0.8,
        }
    },
    icon: { display: 'none' },
}

// tokens
export const stackItemPadding: IStackItemTokens = {
    padding: 10,
}