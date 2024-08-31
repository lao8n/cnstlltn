import { IStackStyles, mergeStyles, IButtonStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme' 

const theme = CnstlltnTheme

// stacks
export const noteStackStyle: IStackStyles = {
    root: {
        width: 600,
        display: 'flex',
        overflow: 'auto',
        background: theme.palette.black,
        paddingLeft: '5px', 
        paddingRight: '5px',
        position: 'relative',
        boxSizing: 'border-box', 
        '::before': {
            content: '""', 
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px', 
            backgroundColor: theme.palette.themeLight, 
        }
    }
}

export const noteSubStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box', 
    }
}

export const noteSubStackItemStyle: IStackStyles = {
    root: {
        display: 'flex',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box', 
    }
}

// buttons
export const deleteButtonStyle: IButtonStyles = {
    root: {
        color: theme.palette.white,
        height: '30px',
        width: '30px',
    },
}

// text
export const noteLogoStyle: IStackStyles = {
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 5,
        color: theme.palette.white,
    }
}

export const noteNameStyle = mergeStyles({
    fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
    fontSize: '12px',
    color: theme.palette.white,
});

export const exampleImageStyle: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themeSecondary,
        paddingBottom: '10px',
        boxSizing: 'border-box', 
    }
}

export const exampleImageTextStyle: IStackStyles = {
    root: {
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        fontSize: '12px',
        color: theme.palette.black,
        padding: '10px',
    }
}