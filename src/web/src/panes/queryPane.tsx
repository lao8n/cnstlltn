// react imports
import { SearchBox, Stack } from '@fluentui/react';
import { FC, ReactElement, useState, useContext, useEffect, useMemo, ChangeEvent } from "react";
// state imports
import { AppContext } from '../state/applicationState';
import { Query, QueryResponse } from '../state/queryState';
import UserAppContext from '../state/userContext';
import { bindActionCreators } from '../state/actions/actionCreators';
import { UserActions } from '../state/actions/userActions';
import * as userActions from '../state/actions/userActions';
import { QueryActions } from '../state/actions/queryActions';
import * as queryActions from '../state/actions/queryActions';
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
import { badInputNotifications, queryBarStyle, queryStackStyle } from '../ux/panes/query';
// ux imports
import '../ux/components.css'
import { stackItemPadding, buttonStyles, selectedButtonStyles, queryFieldStyles } from '../ux/panes/query';

const QueryPane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        query: bindActionCreators(queryActions, appContext.dispatch) as unknown as QueryActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);

    // display
    const [newQuery, setNewQuery] = useState('');
    const [emptyQuery, setEmptyQuery] = useState(false);
    const [newSource, setNewSource] = useState('');
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const [emptySelection, setEmptySelection] = useState(false);
    const [isSecondSearchVisible, setIsSecondSearchVisible] = useState(false);
    const onTypeQuery = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        // console.log("onTypeQuery:", newValue)
        setNewQuery(newValue || '');
    }
    const onTypeSource = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        // console.log("onTypeQuery:", newValue)
        setNewSource(newValue || '');
    }

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
    const onSubmit = async () => {
        if (newQuery) {
            if (newQuery && appContext.state.userState.constellationName !== "Home") {
                const query: Query = {userTxt: newQuery, source: newSource}
                await actions.query.postQueryResponseList(query) // reducer updates state
                // set selected responses to empty
                setSelectedResponses(new Set());
            }
        } else {
            setEmptyQuery(true);
        }
    }
    const createConstellation = async () => {
        if (newQuery) {
            const responses: QueryResponse[] = [{ title: newQuery, content: "" }];
            const createdConstellation = await actions.constellation.saveSelectedFrameworks(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                responses,
            )
            console.log(createdConstellation)
            actions.display.setUpdated(Date.now());
        } else {
            setEmptyQuery(true);
        }
    }
    const saveSelectedResponses = async () => {
        if (selectedResponses.size > 0 ) {
            console.log("queryResponseList " + appContext.state.queryState.responses)
            const responsesToSave = Array.from(selectedResponses).map(index => appContext.state.queryState.responses?.[index])
                .filter((response): response is QueryResponse => response !== undefined);
            // Now, you can save 'responsesToSave' to the database
            console.log("responses to save " + responsesToSave)
            const savedFrameworks = await actions.constellation.saveSelectedFrameworks(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                responsesToSave);
            console.log("saved Frameworks " + savedFrameworks)
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
        setNewSource('');
        actions.query.setEmptyQueryResponseList();
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
                    {appContext.state.userState.constellationName !== "Home" && (
                        <Stack.Item align="stretch">
                        <button onClick={toggleSecondSearch} style={{ height: '100%', marginRight: '1px' }}>
                            {isSecondSearchVisible ? '▲' : '▼'}
                        </button>
                        </Stack.Item>
                    )}
                    <Stack.Item styles={queryBarStyle}>
                        <SearchBox
                            value={newQuery}
                            placeholder={
                                appContext.state.userState.constellationName === "Home" ?
                                    "Enter name for new constellation" : "Prompt for notes"}
                            onChange={onTypeQuery}
                            onSearch={onSubmit}
                            styles={queryFieldStyles}
                            />
                    </Stack.Item>
                </Stack>
                {appContext.state.userState.constellationName !== "Home" && isSecondSearchVisible && (
                    <Stack.Item>
                        <SearchBox
                            value={newSource}
                            placeholder="Copy-paste source article or video transcript"
                            onChange={onTypeSource}
                            onSearch={onSubmit}
                            styles={queryFieldStyles}
                            iconProps={{styles: {root: { display: 'none' }}}} // hides search icon
                        />
                    </Stack.Item>
                )}
            </Stack.Item>
            {emptyQuery &&
                (
                    appContext.state.userState.constellationName === "Home" ?
                        <Stack.Item styles={badInputNotifications}>
                        Hey, try to typing a constellation title in the box above and then click create below.
                    </Stack.Item> :
                    <Stack.Item styles={badInputNotifications}>
                        Hey, add a prompt first before searching for notes. Try 'Poor Charlie's Almanac'.
                    </Stack.Item>
                )
            }
            {
                emptySelection && appContext.state.userState.constellationName !== "Home" && (
                    <Stack.Item styles={badInputNotifications}>
                        Click on the notes you want to save before trying to save to constellation.
                    </Stack.Item>
                )
            }
            <Stack.Item tokens={stackItemPadding}>
                {appContext.state.queryState.responses && appContext.state.queryState.responses.map((response, index) => (
                    <button 
                        key={index} 
                        className={selectedResponses.has(index) ? selectedButtonStyles: buttonStyles} 
                        onClick={() => toggleResponseSelection(index)}>
                        {response.title}: {response.content}
                    </button>
                ))}
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                <button onClick={
                    appContext.state.userState.constellationName === "Home" ?
                        createConstellation : saveSelectedResponses}>
                    {appContext.state.userState.constellationName === "Home" ?
                        "Create new constellation" : "Save selected notes to constellation"}
                </button>
            </Stack.Item>
        </Stack>
    );
}; 

export default QueryPane;