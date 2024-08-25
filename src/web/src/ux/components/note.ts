// react imports
import { IStackStyles, ITextFieldStyles } from "@fluentui/react";
// ux imports
import { CnstlltnTheme } from "../shared/theme";

const theme = CnstlltnTheme;
export const noteComponentStackStyle: IStackStyles = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    }
}

export const noteTextFieldStyle: Partial<ITextFieldStyles> = {
    root: {
        width: '100%',
        backgroundColor: theme.palette.themeSecondary,
    },
    fieldGroup: {
        minHeight: '25px',
        border: 'none',
        selectors: {
            ':focus': {
                borderColor: theme.palette.white,
                borderWidth: '2px',
                borderStyle: 'solid',
            }
        }
    },
    field: {
        color: theme.palette.white,
        background: theme.palette.themeSecondary,
    }
}
