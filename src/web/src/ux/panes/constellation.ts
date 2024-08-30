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

export const createConstellationStackStyle: IStackStyles = {
    root: {
        width: '100%',
        paddingBottom: '23px', // 10px padding + 13px searchBox height
    }
}

export const buttonStackStyle = (active: boolean): IStackStyles => {
    if (active) {
        return {
            root: {
                color: theme.palette.white,
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingBottom: '15px',
                '::after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: `10px`,
                    right: `10px`,
                    bottom: '5px',
                    height: '2px',
                    backgroundColor: theme.palette.white,
                },
            }
        }
    } else {
        return {
            root: {
                paddingTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingBottom: '15px',
                '::after': {
                    left: `10px`,
                    right: `10px`,
                    display: 'none',
                    bottom: '5px',
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
export const canvasHeaderButtonStyle = mergeStyles({
    border: 'none',
    color: theme.palette.white,
    backgroundColor: theme.palette.black,
    fontSize: '12px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.themeLight,
        color: theme.palette.black,
    }
});

export const clusteringSuggestionButtonStyle = mergeStyles({
    flexShrink: 0,
    border: 'none',
    backgroundColor: theme.palette.black,
    color: theme.palette.white,
    transition: 'background-color 0.3s',
    fontSize: '12px',
    padding: '5px',
    '&:hover': {
        backgroundColor: theme.palette.themeLight,
        color: theme.palette.black,
    }
});

export const selectClusteringStyle = mergeStyles({
    flexGrow: 1,
    border: 'none',
    backgroundColor: theme.palette.black,
    color: theme.palette.white,
    transition: 'background-color 0.3s',
    fontSize: '12px',
    padding: '5px',
    '&:hover': {
        backgroundColor: theme.palette.themeLight,
        color: theme.palette.black,
    }
});

export const deleteConstellationButtonStyle = mergeStyles({
    flexShrink: 0,
    border: 'none',
    backgroundColor: theme.palette.black,
    color: theme.palette.white,
    transition: 'background-color 0.3s',
    fontSize: '12px',
    padding: '5px',
    '&:hover': {
        backgroundColor: theme.palette.themeLight,
        color: theme.palette.black,
    }
});

// text
export const constellationNameStyle = mergeStyles({
    fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
    fontSize: '30px',
    color: theme.palette.white,
});

export const createConstellationButtonStyle: Partial<ITextFieldStyles> = {
    root: {
        width: '100%',
    },
    field: {  // This targets the input element itself
        color: theme.palette.black,
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '::placeholder': {
            color: theme.palette.black,
            opacity: 0.8,
        }
    },
    icon: {
        width: '0px',
    },
    suffix: {
        display: 'none',
    }
}

export const clusterByStyle: Partial<ITextFieldStyles> = {
    root: {
        width: '100%',
    },
    fieldGroup: {  // This targets the surrounding container of the input
        backgroundColor: theme.palette.black,
    },
    field: {  // This targets the input element itself
        color: theme.palette.black,
        fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '::placeholder': {
            color: theme.palette.black,
            opacity: 0.8,
        }
    },
    icon: {
        width: '0px',
    },
}