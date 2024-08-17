import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'

const theme = CnstlltnTheme

export const queryStackStyle: IStackStyles = {
    root: {
        width: 500,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8,
    }
}