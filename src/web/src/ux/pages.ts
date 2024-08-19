import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const routesLayoutPageStyle: IStackStyles = {
    root: {
        width: '100vw',
        height: '100vh',
        background: theme.palette.black,
        overflow: 'hidden',
    }
}

export const routePageStyle: IStackStyles = {
    root: {
        background: theme.palette.black,
        color: theme.palette.white,
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const constellationQueryPageStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const constellationPageStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const queryPageStyle: IStackStyles = {
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
    }
}

export const loginPageStyle: IStackStyles = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export const updatesPageStyle: IStackStyles = {
    root: {
        width: '100%',
        display: 'flex',
    }
}