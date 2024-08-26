import { IStackStyles, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme

export const welcomeStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const welcomeLineStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '20px',
    color: theme.palette.white,
    padding: '10px'
});

export const welcomeCaptionStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '30px',
    color: theme.palette.white,
});