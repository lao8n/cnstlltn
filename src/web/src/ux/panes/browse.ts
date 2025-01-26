// react imports
import { IStackStyles, IButtonStyles, mergeStyles } from "@fluentui/react";     
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme;
// stacks
export const browsePaneStyle: IStackStyles = {
    root: {
        height: '100%',
        width: '100%',
        overflow: 'auto',
    }
}

export const browsePaneItemStyle: IStackStyles = {
    root: {
        height: '100%',
    }
}

export const browseStackStyle: IStackStyles = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
    }
}

export const browseBarStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const browseButtonStackStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const drillDownButtonStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'stretch',
        width: 'auto',
        selectors: {
            '&:hover': {
                backgroundColor: theme.palette.themeSecondary,
                color: theme.palette.white,
            }
        }
    }
}

export const drillUpButtonStackStyle: IStackStyles = {
    root: {
        width: '100%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.black,
        fontSize: '12px',
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        selectors: {
            '&:hover': {
                backgroundColor: theme.palette.themeSecondary,
                color: theme.palette.white,
            }
        }
    }
}

// buttons
export const drillUpIconStyles = mergeStyles({
    root: {
        width: '100%',
        display: 'flex',
        textAlign: 'left',
        border: 'none',
    },
})

export const drillDownButtonStyles: IButtonStyles = {
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        paddingTop: '40px',
        paddingBottom: '40px',
    },
    icon: {
        fontSize: '10px', // Adjust icon size as needed
        flex: '0 0 auto', // Prevent icon from stretching
    },
    flexContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around', // This will create equal space above and below
    }
}

export const materialAttachedButtonStyle: IButtonStyles = {
    root: {
        color: theme.palette.black
    },
}

export const toggleSetSourceButtonStyle: IButtonStyles = {
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