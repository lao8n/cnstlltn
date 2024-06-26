import { IStackItemTokens, IStackStyles, IStackTokens } from '@fluentui/react'
import { CnstlltnTheme } from './theme'
import { mergeStyles } from '@fluentui/react';

const theme = CnstlltnTheme

export const queryFieldStyles = {
    field: {
        color: 'theme.palette.black',
    },
};


export const rootStackStyles: IStackStyles = {
    root: {
        height: '100vh',
        background: theme.palette.black,
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
        height: '100%',
    }
}

export const canvasStackStyle: IStackStyles = {
    root: {
        minHeight: 900,
        maxHeight: 1200,
        width: '100%',
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