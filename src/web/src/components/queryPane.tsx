// react imports
import { Stack, TextField } from '@fluentui/react';
import { FC, ReactElement, useState, useContext, useEffect, FormEvent } from "react";
// ux imports
import { queryFieldStyles, stackItemPadding } from '../ux/styles';
import { buttonStyles, selectedButtonStyles } from '../ux/styles';
// state imports
import { AppContext } from '../models/applicationState';
import { Query, QueryResponse } from '../models/queryState';
import UserAppContext from '../components/userContext';
import { bindActionCreators } from '../actions/actionCreators';
import { UserActions } from '../actions/userActions';
import * as userActions from '../actions/userActions';
import { QueryActions } from '../actions/queryActions';
import * as queryActions from '../actions/queryActions';
import { ConstellationActions } from '../actions/constellationActions';
import * as constellationActions from '../actions/constellationActions';
import { DisplayActions } from '../actions/displayActions';
import * as displayActions from '../actions/displayActions';

interface QueryPaneProps {
    query?: Query
    queryResponseList?: QueryResponse[];
    onCreate: (query: Query) => void
}

const QueryPane: FC<QueryPaneProps> = (props: QueryPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = {
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        query: bindActionCreators(queryActions, appContext.dispatch) as unknown as QueryActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    };

    // display
    const [newQuery, setNewQuery] = useState('');
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const onNewQueryChange = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setNewQuery(value || '');
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
    const onFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (newQuery && appContext.state.userState.constellationName !== "Home") {
            props.onCreate({ userTxt: newQuery });
            setNewQuery('');
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
        const queryResponseList = props.queryResponseList || [];
        console.log("queryResponseList " + queryResponseList)
        const responsesToSave = Array.from(selectedResponses).map(index => queryResponseList[index]) ;
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
        setSelectedResponses(new Set());
        actions.query.setEmptyQueryResponseList();
    }, [actions.query, appContext.state.userState.constellationName])

    return (
        <Stack>
            <Stack.Item tokens={stackItemPadding}>
                <form onSubmit={onFormSubmit}>
                    <TextField
                        borderless
                        value={newQuery}
                        placeholder={
                            appContext.state.userState.constellationName === "Home" ?
                                "Enter name of new constellation" : "Enter the name of a book or a link to an article"}
                        onChange={onNewQueryChange}
                        styles={queryFieldStyles}
                    />
                </form>
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                {props.queryResponseList && props.queryResponseList.map((response, index) => (
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