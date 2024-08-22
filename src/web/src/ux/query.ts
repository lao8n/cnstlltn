import { IStackStyles, IStackItemTokens } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const queryStackStyle: IStackStyles = {
    root: {
        width: 500,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8,
    }
}

export const queryBarStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const badInputNotifications: IStackStyles = {
    root: {
        padding: 10,
        color: theme.palette.black
    }
}


export const stackItemPadding: IStackItemTokens = {
    padding: 10,
}