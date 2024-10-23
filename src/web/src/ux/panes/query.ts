import { IStackStyles, IButtonStyles, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme;

// stacks
export const queryStackStyle: IStackStyles = {
    root: {
        width: '100%',
        overflow: 'auto',
    }
}

export const queryBarStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const toggleSecondSearchButtonStyle: IButtonStyles = {
    root: {
        color: theme.palette.black
    },
    // TODO: add root hovered and root pressed
}

export const buttonTextStyles = mergeStyles({
    color: theme.palette.black,
    textAlign: 'left',
    width: '100%',
    display: 'block',
    fontSize: '12px',
    fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
    '&:hover': {
        color: theme.palette.white,
        backgroundColor: theme.palette.themeSecondary,
    }
});
  
export const selectedButtonTextStyles = mergeStyles(buttonTextStyles, {
    color: theme.palette.white,
  });