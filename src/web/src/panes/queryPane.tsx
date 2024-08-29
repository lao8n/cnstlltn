// react imports
import { SearchBox, Stack, IconButton } from '@fluentui/react';
import { FC, ReactElement, useState, useContext, useEffect, useMemo, ChangeEvent } from "react";
// state imports
import { AppContext } from '../state/applicationState';
import { Query, QueryResponse } from '../state/queryState';
import UserAppContext from '../state/userContext';
import { bindActionCreators } from '../state/actions/actionCreators';
import { QueryActions } from '../state/actions/queryActions';
import * as queryActions from '../state/actions/queryActions';
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// components imports
import { LoadingDots } from '../components/loadingDots';
// ux imports
import { queryBarStyle, queryStackStyle, toggleSecondSearchButtonStyle } from '../ux/panes/query';
import { stackItemPadding, saveSelectedButtonStyle, queryFieldStyles, badInputNotifications, buttonStyles, selectedButtonStyles } from '../ux/shared/components';
import { blackLoadingDots } from '../ux/components/loadingDots';

const QueryPane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        query: bindActionCreators(queryActions, appContext.dispatch) as unknown as QueryActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);

    // display
    const [newQuery, setNewQuery] = useState('');
    const [emptyQuery, setEmptyQuery] = useState(false);
    const [newMaterial, setNewMaterial] = useState('');
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const [emptySelection, setEmptySelection] = useState(false);
    const [isSecondSearchVisible, setIsSecondSearchVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // functions
    const toggleResponseSelection = (index: number) => {
        const newSelectedResponses = new Set(selectedResponses);
        if (newSelectedResponses.has(index)) {
            newSelectedResponses.delete(index);
        } else {
            newSelectedResponses.add(index);
        }
        setSelectedResponses(newSelectedResponses);
    };
    const toggleSecondSearch = () => {
        setIsSecondSearchVisible(!isSecondSearchVisible);
    };
    const onTypeQuery = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewQuery(newValue || '');
    }
    const onTypeMaterial = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewMaterial(newValue || '');
    }
    const onSubmit = async () => {
        if (newQuery) {
            setIsLoading(true);
            const query: Query = {userTxt: newQuery, material: newMaterial}
            const queryResponses = await actions.query.postQueryResponseList(query)
            actions.query.setQueryResponseList(queryResponses)
            setSelectedResponses(new Set()); // set to empty
            setIsLoading(false);
        } else {
            setEmptyQuery(true);
        }
    }
    const saveSelectedResponses = async () => {
        if (selectedResponses.size > 0 ) {
            console.log("queryResponseList " + appContext.state.queryState.responses)
            const responsesToSave = Array.from(selectedResponses).map(index => appContext.state.queryState.responses?.[index])
                .filter((response): response is QueryResponse => response !== undefined);
            for (const response of responsesToSave) {
                console.log("response " + response)
            }
            const savedFrameworks = await actions.constellation.saveSelectedFrameworks(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                responsesToSave);
            for (const framework of savedFrameworks) {
                console.log("framework " + framework)
            }
            // set selected responses to empty
            setSelectedResponses(new Set());
            actions.display.setUpdated(Date.now());
        } else {
            setEmptySelection(true);
        }
    };

    // effects
    useEffect(() => {
        console.log("query pane reset")
        setSelectedResponses(new Set());
        setIsSecondSearchVisible(false);
        setNewMaterial('');
        actions.query.setQueryResponseList(undefined);
    }, [actions.query, appContext.state.userState.constellationName])

    useEffect(() => {
        console.log("non-empty query")
        if (newQuery) {
            setEmptyQuery(false);
        }
    }, [newQuery])
    
    useEffect(() => {
        console.log("non-empty selection")
        if (selectedResponses.size > 0) {
            setEmptySelection(false);
        }
    }, [selectedResponses])

    return (
        <Stack styles={queryStackStyle}>
            <Stack.Item tokens={stackItemPadding}>
                <Stack horizontal styles={queryBarStyle}>
                    <Stack.Item align="stretch">
                        <IconButton aria-label="Toggle second search" iconProps={{ iconName: isSecondSearchVisible ? "ChevronDown" : "ChevronRight" }} onClick={toggleSecondSearch} styles={toggleSecondSearchButtonStyle} />
                    </Stack.Item>
                    <Stack.Item styles={queryBarStyle}>
                        <SearchBox
                            value={newQuery}
                            placeholder={
                                "Prompt for notes"}
                            onChange={onTypeQuery}
                            onSearch={onSubmit}
                            styles={queryFieldStyles}
                            />
                    </Stack.Item>
                </Stack>
                {isSecondSearchVisible && (
                    <Stack.Item>
                        <SearchBox
                            value={newMaterial}
                            placeholder="Copy-paste source article or video transcript"
                            onChange={onTypeMaterial}
                            onSearch={onSubmit}
                            styles={queryFieldStyles}
                            iconProps={{styles: {root: { display: 'Copy' }}}}
                        />
                    </Stack.Item>
                )}
            </Stack.Item>
            {emptyQuery &&
                (
                    <Stack.Item styles={badInputNotifications}>
                        Hey, add a prompt first before searching for notes. Try 'Poor Charlie's Almanac'.
                    </Stack.Item>
                )
            }
            {
                appContext.state.queryState.responses?.length === 0 && emptySelection && (
                    <Stack.Item styles={badInputNotifications}>
                        Hey, add a prompt first - maybe try 48 Laws of Power by Robert Greene. Then if you like any of the results select them and try again.
                    </Stack.Item>
                )
            }
            {
                appContext.state.queryState.responses?.length !== 0 && emptySelection && (
                    <Stack.Item styles={badInputNotifications}>
                        Click on the notes you want to save before trying to save to constellation.
                    </Stack.Item>
                )
            }
            <Stack.Item tokens={stackItemPadding}>
                {isLoading ? (
                    <LoadingDots style={blackLoadingDots}/>
                ) : (
                    appContext.state.queryState.responses && appContext.state.queryState.responses.map((response, index) => (
                        <button 
                        key={index} 
                        className={selectedResponses.has(index) ? selectedButtonStyles: buttonStyles} 
                        onClick={() => toggleResponseSelection(index)}>
                        <strong>{response.title}</strong>: {response.content}
                    </button>
                )))}
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                <button className={saveSelectedButtonStyle} onClick={saveSelectedResponses}>
                    {"Save selected notes to constellation"}
                </button>
            </Stack.Item>
        </Stack>
    );
}; 

export default QueryPane;