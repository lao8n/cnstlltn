import { IStackStyles, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme' 

const theme = CnstlltnTheme

// stacks
export const noteStackStyle: IStackStyles = {
    root: {
        width: 500,
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
        width: '100%',
        overflow: 'auto',
    }
}

// note
export const noteLogoStyle: IStackStyles = {
    root: {
        height: 12,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 5,
    }
}

// text
export const noteNameStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '20px',
    color: theme.palette.white,
});
