import { IStackStyles, ITextStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme;

export const loginPageStyle: IStackStyles = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
    }
}

export const loginPageLeftStyle: IStackStyles = {
    root: {
        width: '50%',
        height: '100%',
        backgroundColor: theme.palette.themeSecondary,
        padding: '20px',
    }
}

export const loginPageRightStyle: IStackStyles = {
    root: {
        width: '50%',
        height: '100%',
        display: 'flex',
        backgroundColor: theme.palette.white,
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export const loginPageLeftTextStyle: ITextStyles = {
    root: {
        fontSize: '50px',
        fontWeight: 'bold',
        color: theme.palette.white,
    }
}