import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const routesLayoutStackStyle: IStackStyles = {
    root: {
        width: '100vw',
        height: '100vh',
        background: theme.palette.black,
        overflow: 'hidden',
    }
}

export const routeStackStyle: IStackStyles = {
    root: {
        background: theme.palette.black,
        color: theme.palette.white,
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
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
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const queryStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
    }
}

export const loginStackStyle: IStackStyles = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}