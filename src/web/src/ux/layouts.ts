import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const layoutStackStyle: IStackStyles = {
    root: {
        width: '100vw',
        height: '100vh',
        background: theme.palette.black,
        overflow: 'hidden',
    }
}

export const headerStackStyle: IStackStyles = {
    root: {
        height: 48,
        background: theme.palette.themePrimary,
    }
}

export const routeStackStyle: IStackStyles = {
    root: {
        background: theme.palette.black,
        color: theme.palette.white,
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden', // This prevents any overflow caused by growing content
    }
}

export const constellationQueryStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const constellationStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
    }
}

export const welcomeStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}


export const canvasStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const queryStackStyle: IStackStyles = {
    root: {
        width: 500,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8,
    }
}