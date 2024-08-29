import { IStackStyles, IButtonStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme;

// stacks
export const queryStackStyle: IStackStyles = {
    root: {
        width: '100%',
        overflow: 'auto',
    }
}

export const queryBarStyle: IStackStyles = {
    root: {
        width: '100%',
    }
}

export const toggleSecondSearchButtonStyle: IButtonStyles = {
    root: {
        color: theme.palette.black
    },
    // TODO: add root hovered and root pressed
}