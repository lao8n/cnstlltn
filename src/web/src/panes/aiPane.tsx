// react imports
import { Stack } from '@fluentui/react';
import { FC, ReactElement, useState, useContext, useMemo } from "react";
// pages & panes imports
import QueryPane from './queryPane';
import BrowsePane from './browsePane';
import AnalysePane from './analysePane';
// state imports
import { AppContext } from '../state/applicationState';
import UserAppContext from '../state/userContext';
import { bindActionCreators } from '../state/actions/actionCreators';
import { QueryActions } from '../state/actions/queryActions';
import * as queryActions from '../state/actions/queryActions';
// ux imports
import { aiStackStyle, aiButtonStackStyle, aiButtonStyle } from "../ux/panes/ai";

const AIPane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        query: bindActionCreators(queryActions, appContext.dispatch) as unknown as QueryActions,
    }), [appContext.dispatch]);
    const buttons = ["PROMPT", "BROWSE", "ANALYSE"];
    const [selectedButton, setSelectedButton] = useState(buttons[0]);
    const onButtonClick = (tabName: string) => {
        console.log("on button click", tabName)
        setSelectedButton(tabName);
        actions.query.setQueryResponses(undefined)
    }
    return (
        <Stack styles={aiStackStyle}>
            <Stack horizontal>
                {buttons.map((label, _) => (
                    <Stack.Item styles={aiButtonStackStyle(selectedButton === label)}>
                        <button type="button" onClick={() => onButtonClick(label)} className={aiButtonStyle}>
                            {label}
                        </button>
                    </Stack.Item>
                ))}
            </Stack>
            {
                selectedButton === "PROMPT" && (
                    <Stack>
                        <QueryPane/>
                    </Stack>
                )
            }
            {
                selectedButton === "BROWSE" && (
                    <Stack>
                        <BrowsePane/>
                    </Stack>
                )
            }
            {
                selectedButton === "ANALYSE" && (
                    <Stack>
                        <AnalysePane/>
                    </Stack>
                )
            }
        </Stack>
    )
}

export default AIPane;
