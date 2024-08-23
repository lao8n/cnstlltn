import { IStackStyles, IStackItemTokens, ITextFieldStyles, mergeStyles } from '@fluentui/react'
import { CnstlltnTheme } from '../shared/theme'

const theme = CnstlltnTheme

// stacks
export const constellationStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const constellationHeaderStackStyle: IStackStyles = {
    root: {
        justifyContent: 'space-between',
    }
}

// tokens
export const stackItemPadding: IStackItemTokens = {
    padding: 10,
}

// text
export const constellationNameStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '20px',
    color: theme.palette.white,
});

export const clusterByWordStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '15px',
    color: theme.palette.white,
    alignItems: 'right',
    paddingTop: 5,
    paddingRight: 5,
});

export const clusterByStyle: Partial<ITextFieldStyles> = {
    root: {
        minWidth: 800,
    },
    fieldGroup: {  // This targets the surrounding container of the input
        backgroundColor: theme.palette.black,
    },
    field: {  // This targets the input element itself
        color: theme.palette.black,
        fontFamily: "Segoe UI",
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
}