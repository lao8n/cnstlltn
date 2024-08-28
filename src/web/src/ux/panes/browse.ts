// react imports
import { IStackStyles, IButtonStyles } from "@fluentui/react";     

// stacks
export const browsePaneStyle: IStackStyles = {
    root: {
        width: '100%',
        overflow: 'auto',
    }
}

export const browseStackStyle: IStackStyles = {
    root: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'center',
    }
}

export const browseButtonStackStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const drillDownButtonStackStyle: IStackStyles = {
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
    }
}

// buttons
export const drillDownButtonStyles: IButtonStyles = {
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0, // Remove padding
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