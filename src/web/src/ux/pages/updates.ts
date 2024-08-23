import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './../theme'

const theme = CnstlltnTheme

export const updatesPageStyle: IStackStyles = {
    root: {
        width: '100%',
        display: 'flex',
    }
}

export const updateHeadingStyle: IStackStyles = {
    root: {
        fontFamily: "Segoe UI",
        fontSize: '20px',
        color: theme.palette.white,
        padding: '10px'
    }
}

export const updateTextStyle: IStackStyles = {
    root: {
        fontFamily: "Segoe UI",
        fontSize: '15px',
        color: theme.palette.white,
        padding: '10px'
    }
}