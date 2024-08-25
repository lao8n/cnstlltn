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
        width: '100%',
    }
}

export const buttonStackStyle = (active: boolean): IStackStyles => {
    if (active) {
        return {
            root: {
                color: theme.palette.white,
                position: 'relative',
                overflow: 'hidden',
                paddingRight: '10px',
                paddingBottom: '10px',
                '::after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '2px',
                    backgroundColor: 'white',
                },
            }
        }
    } else {
        return {
            root: {
                '::after': {
                    display: 'none',
                },
            }
        }
    }
}

// tokens
export const stackItemPadding: IStackItemTokens = {
    padding: 10,
}

// buttons
export const clusterByButtonStyle = {
    border: 'none',
    color: theme.palette.white,
    backgroundColor: theme.palette.black
}

export const clusteringSuggestionButtonStyle = {
    flexShrink: 0,
    border: 'none',
    fontFamily: 'Segoe UI',
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