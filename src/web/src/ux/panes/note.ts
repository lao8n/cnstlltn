import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme' 

const theme = CnstlltnTheme

export const noteStackStyle: IStackStyles = {
    root: {
        width: 500,
        overflow: 'auto',
        background: theme.palette.neutralPrimary,
    }
}
