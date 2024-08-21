// react imports
import { SearchBox, Stack } from '@fluentui/react';
import { FC, ReactElement, useState, useContext, useEffect, useMemo, ChangeEvent } from "react";
// ux imports
import { stackItemPadding } from '../ux/tokens';
import { buttonStyles, selectedButtonStyles, queryFieldStyles } from '../ux/components';
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
import { queryStackStyle } from '../ux/query';

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
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const onTypeQuery = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        // console.log("onTypeQuery:", newValue)
        setNewQuery(newValue || '');
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
    const onSubmit = async () => {
        if (newQuery && appContext.state.userState.constellationName !== "Home") {
            const query: Query = {userTxt: newQuery}
            await actions.query.postQueryResponseList(query) // reducer updates state
             // set selected responses to empty
            setSelectedResponses(new Set());
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
        }
    }
    const saveSelectedResponses = async () => {
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
    };

    // effects
    useEffect(() => {
        console.log("set empty query response list")
        setSelectedResponses(new Set());
        actions.query.setEmptyQueryResponseList();
    }, [actions.query, appContext.state.userState.constellationName])

    return (
        <Stack styles={queryStackStyle}>
            <Stack.Item tokens={stackItemPadding}>
                <SearchBox
                    value={newQuery}
                    placeholder={
                        appContext.state.userState.constellationName === "Home" ?
                            "Enter name of new constellation" : "Prompt for notes or copy in an article or transcript"}
                    onChange={onTypeQuery}
                    onSearch={onSubmit}
                    styles={queryFieldStyles}
                    />
            </Stack.Item>
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
                        "Create Constellation" : "Save to Constellation"}
                </button>
            </Stack.Item>
        </Stack>
    );
}; 

export default QueryPane;