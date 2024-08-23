import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './../theme'

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