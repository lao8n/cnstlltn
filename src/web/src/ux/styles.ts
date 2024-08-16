import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const rootStackStyles: IStackStyles = {
    root: {
        width: '100vw',
        height: '100vh',
        background: theme.palette.black,
        overflow: 'hidden',
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
        overflow: 'hidden', // This prevents any overflow caused by growing content
        display: 'flex',    // Optional: If you want to ensure child elements align as flexbox
    }
}

export const canvasStackStyle: IStackStyles = {
    root: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        // minHeight: 800,
        // maxHeight: 1500,
    }
}

export const sidebarStackStyles: IStackStyles = {
    root: {
        minWidth: 500,
        maxWidth: 500,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8,
    }
}

export const titleStackStyles: IStackStyles = {
    root: {
        alignItems: 'center',
        background: theme.palette.neutralPrimaryAlt,
    }
}