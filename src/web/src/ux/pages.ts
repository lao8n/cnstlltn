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