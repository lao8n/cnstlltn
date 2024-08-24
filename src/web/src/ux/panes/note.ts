import { IStackStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme' 

const theme = CnstlltnTheme

export const noteStackStyle: IStackStyles = {
    root: {
        width: 500,
        overflow: 'auto',
        background: theme.palette.black,
        paddingLeft: '5px', 
        '::before': {
            content: '""', 
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px', 
            backgroundColor: theme.palette.white, 
        }
    }
}
