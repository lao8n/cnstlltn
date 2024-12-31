import { IStackStyles, mergeStyles } from "@fluentui/react";
import { CnstlltnTheme } from "../shared/theme";

const theme = CnstlltnTheme;

// stacks
export const analyseStackStyle: IStackStyles = {
    root: {
        width: '100%',
        overflow: 'auto',
    }
}

export const buttonTextStyles = mergeStyles({
    color: theme.palette.black,
    textAlign: 'left',
    width: '100%',
    display: 'block',
    fontSize: '12px',
    fontFamily: '"Segoe UI", "Noto Sans", "Helvetica Neue"',
    '&:hover': {
        color: theme.palette.white,
        backgroundColor: theme.palette.themeSecondary,
    }
});