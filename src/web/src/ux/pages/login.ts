import { IStackStyles } from '@fluentui/react'
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
        flexDirection: 'column',
        justifyContent: 'space-between', // Distributes space between items
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

export const loginPageLeftTopTextStyle: IStackStyles = {
    root: {
        fontSize: '70px',
        fontWeight: 'bold',
        color: theme.palette.white,
        alignSelf: 'flex-start', // Aligns to the left
        marginTop: 'auto', // Pushes the text to the bottom of its container
    }
}

export const loginPageLeftBottomTextStyle: IStackStyles = {
    root: {
        fontSize: '70px',
        fontWeight: 'bold',
        color: theme.palette.white,
        alignSelf: 'flex-start', // Aligns to the left
    }
}