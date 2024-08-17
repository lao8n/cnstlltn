import { ITextFieldStyles } from '@fluentui/react'
import { mergeStyles } from '@fluentui/react';
import { CnstlltnTheme } from './theme'
import { IStackStyles } from '@fluentui/react'

const theme = CnstlltnTheme

export const canvasStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const canvasStyle = {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
};

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

export const welcomeLineStyle = mergeStyles({
    fontFamily: "Segoe UI",
    fontSize: '20px',
    color: theme.palette.white,
    padding: '10px'
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
        color: theme.palette.black,
        fontFamily: "Segoe UI",
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
}