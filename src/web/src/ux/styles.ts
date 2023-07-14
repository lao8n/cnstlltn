import { IStackItemTokens, IStackStyles, IStackTokens } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const rootStackStyles: IStackStyles = {
    root: {
        height: '100vh',
    }
}

export const headerStackStyles: IStackStyles = {

    root: {
        height: 48,
        background: theme.palette.themePrimary,
    }
}

export const listItemsStackStyles: IStackStyles = {
    root: {
        padding: '10px'
    }
}

export const mainStackStyles: IStackStyles = {
    root: {
        background: theme.palette.black,
        color: theme.palette.white,
    }
}

export const sidebarStackStyles: IStackStyles = {
    root: {
        minWidth: 500,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8,
        color: theme.palette.black,
    }
}

export const titleStackStyles: IStackStyles = {
    root: {
        alignItems: 'center',
        background: theme.palette.neutralPrimaryAlt,
    }
}

export const stackPadding: IStackTokens = {
    padding: 10
}

export const stackGaps: IStackTokens = {
    childrenGap: 10
}

export const stackItemPadding: IStackItemTokens = {
    padding: 10
}

export const stackItemMargin: IStackItemTokens = {
    margin: 10
}