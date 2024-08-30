// react imports
import { IStackStyles, ITextFieldStyles } from "@fluentui/react";
// ux imports
import { CnstlltnTheme } from "../shared/theme";

const theme = CnstlltnTheme;
export const noteComponentStackStyle: IStackStyles = {
    root: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    }
}

export const noteTextFieldStyle: Partial<ITextFieldStyles> = {
    root: {
        width: '100%',
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
        fontColor: theme.palette.white,
        backgroundColor: theme.palette.themeSecondary,
    }
}
