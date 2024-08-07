import { IStackItemTokens, IStackStyles, IStackTokens, ITextFieldStyles } from '@fluentui/react'
import { CnstlltnTheme } from './theme'
import { mergeStyles } from '@fluentui/react';

const theme = CnstlltnTheme

export const rootStackStyles: IStackStyles = {
    root: {
        width: '100vw',
        height: '100vh',
        background: theme.palette.black,
        overflow: 'hidden',
    }
}

export const headerStackStyles: IStackStyles = {

    root: {
        height: 48,
        background: theme.palette.themePrimary,
    }
}

export const listItemsStackStyles: IStackStyles = {
    root: {
        padding: '10px'
    }
}

export const mainStackStyles: IStackStyles = {
    root: {
        background: theme.palette.black,
        color: theme.palette.white,
    }
}

export const canvasStackStyle: IStackStyles = {
    root: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        minHeight: 800,
        maxHeight: 1500,
    }
}

export const sidebarStackStyles: IStackStyles = {
    root: {
        minWidth: 500,
        maxWidth: 500,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8,
    }
}

export const titleStackStyles: IStackStyles = {
    root: {
        alignItems: 'center',
        background: theme.palette.neutralPrimaryAlt,
    }
}

export const stackPadding: IStackTokens = {
    padding: 10
}

export const stackGaps: IStackTokens = {
    childrenGap: 10
}

export const stackItemPadding: IStackItemTokens = {
    padding: 10,
}

export const stackItemMargin: IStackItemTokens = {
    margin: 10
}

// Define styles for the button
export const buttonStyles = mergeStyles({
    backgroundColor: theme.palette.neutralPrimary,
    color: theme.palette.black,
    margin: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.neutralPrimaryAlt
    }
});

export const selectedButtonStyles = mergeStyles(buttonStyles, {
    backgroundColor: theme.palette.themePrimary,
    color: theme.palette.white,
});

export const clusterButtonStyles = mergeStyles(buttonStyles, {
    alignItems: 'flex-end',
})

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

export const queryFieldStyles = {
    field: {
        color: theme.palette.black,
        fontFamily: "Segoe UI",
    },
};


export const clusterByStyle: Partial<ITextFieldStyles> = {
    root: {
        minWidth: 800,
    },
    fieldGroup: {  // This targets the surrounding container of the input
        backgroundColor: theme.palette.black,
    },
    field: {  // This targets the input element itself
        color: theme.palette.white,
        fontFamily: "Segoe UI",
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
}
