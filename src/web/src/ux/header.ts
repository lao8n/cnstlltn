import { IButtonStyles, IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const headerStackStyle: IStackStyles = {
    root: {
        height: 48,
        background: theme.palette.themePrimary,
        justifyContent: 'space-between',
    }
}

export const headerLogoStyles: IStackStyles = {
    root: {
        height: 48,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10,
    }
}

export const headerLogoButtonStyle = {
    width: '100px',
    height: 'auto',
};

export const headerUpdatesStyle: IStackStyles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        height: 48,
    }
}

export const headerLoginStyle: IStackStyles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        height: 48,
        paddingRight: 10
    }
}

export const headerUpdatesButtonStyle: IButtonStyles = {
    root: {
        color: theme.palette.white
    },
}

export const headerLoginButtonStyle: IButtonStyles = {
    root: {
        color: theme.palette.white
    },
    // TODO: add root hovered and root pressed
}