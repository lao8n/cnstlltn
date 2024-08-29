// react imports
import { IStackStyles, IButtonStyles } from "@fluentui/react";     
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
        padding: '10px'
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
    }
}

// buttons
export const drillUpButtonStyles: IButtonStyles = {
    root: {
        width: '100%',
        textAlign: 'left',
    },
    label: {
        textAlign: 'right',
        fontSize: '12px',
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        marginLeft: '5px',
        display: 'inline-block',
    }
}

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