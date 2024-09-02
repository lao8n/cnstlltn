import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme;

export const loginPageStyle: IStackStyles = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export const loginPageLeftStyle: IStackStyles = {
    root: {
        width: '50%',
        fontSize: '50px',
        backgroundColor: theme.palette.themeSecondary,
        color: theme.palette.white,
    }
}

export const loginPageRightStyle: IStackStyles = {
    root: {
        width: '50%',
        backgroundColor: theme.palette.white,
    }
}