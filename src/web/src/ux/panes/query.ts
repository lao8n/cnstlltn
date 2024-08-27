import { IStackStyles, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme

// stacks
export const queryStackStyle: IStackStyles = {
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

export const queryBarStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const badInputNotifications: IStackStyles = {
    root: {
        padding: 10,
        color: theme.palette.black
    }
}

// buttons
export const buttonStyles = mergeStyles({
    backgroundColor: theme.palette.themeLight,
    color: theme.palette.black,
    margin: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
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

export const clusterButtonStyles = mergeStyles(buttonStyles, {
    alignItems: 'flex-end',
})

export const createSaveButtonStyle = mergeStyles({
    width: '100%',
    border: 'none',
    fontFamily: 'Segoe UI',
    paddingTop: '5px',
    paddingBottom: '5px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.themeSecondary,
        color: theme.palette.white,
    }
});

// text
export const queryFieldStyles = {
    field: {
        color: theme.palette.black,
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        '::placeholder': {
            color: theme.palette.black,
            opacity: 0.8,
        }
    },
};

export const queryNameStyle = mergeStyles({
    fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
    fontSize: '15px',
    color: theme.palette.black,
    paddingBottom: '10px',
});