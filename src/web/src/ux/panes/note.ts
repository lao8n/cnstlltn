import { IStackStyles, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme' 

const theme = CnstlltnTheme

// stacks
export const noteStackStyle: IStackStyles = {
    root: {
        width: 500,
        display: 'flex',
        overflow: 'auto',
        background: theme.palette.black,
        paddingLeft: '5px', 
        position: 'relative',
        '::before': {
            content: '""', 
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px', 
            backgroundColor: theme.palette.white, 
        }
    }
}

export const noteSubStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
    }
}

export const noteSubStackItemStyle: IStackStyles = {
    root: {
        display: 'flex',
        height: '100%',
    }
}

// note
export const noteLogoStyle: IStackStyles = {
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 5,
        color: theme.palette.white,
    }
}

// text
export const noteNameStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '20px',
    color: theme.palette.white,
});
