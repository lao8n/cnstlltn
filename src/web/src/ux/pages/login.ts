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
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        display: 'flex',
        flexDirection: 'column',
        height: '100%',  // Ensure the container takes full height
        fontSize: '70px',
        fontWeight: 'bold',
        color: theme.palette.white,
        justifyContent: 'center', // Centers content vertically
        alignItems: 'flex-start', // Aligns text to the left
    }
}