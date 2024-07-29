import { IIconProps, Stack, TextField } from '@fluentui/react';
import React, { FC, ReactElement, useState, useContext, useEffect, FormEvent } from "react";
import { queryFieldStyles, stackItemPadding } from '../ux/styles';
import { Query, QueryResponse } from '../models/queryState';
import { buttonStyles, selectedButtonStyles } from '../ux/styles';
import { bindActionCreators } from '../actions/actionCreators';
import * as userActions from '../actions/userActions';
import UserAppContext from '../components/userContext';
import { AppContext } from '../models/applicationState';
import { UserActions } from '../actions/userActions';


interface QueryPaneProps {
    query?: Query
    queryResponseList?: QueryResponse[];
    onCreate: (query: Query) => void
}

const iconProps: IIconProps = {
    iconName: 'SurveyQuestions'
}

const QueryPane: FC<QueryPaneProps> = (props: QueryPaneProps): ReactElement => {
    const [newQuery, setNewQuery] = useState('');
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const [buttonName, setNewButton] = useState('');
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = {
        queryResponseList: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
    };

    useEffect(() => {
        if (appContext.state.userState.constellationName === "Home") {
            setNewButton('Create Constellation')
        } else {
            setNewButton('Save to Constellation')
        }
    }, [appContext.state.userState.constellationName])

    const onNewQueryChange = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setNewQuery(value || '');
    }

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
        if (newQuery) {
            props.onCreate({ userTxt: newQuery });
            setNewQuery('');
             // set selected responses to empty
            setSelectedResponses(new Set());
        }
    }

    const saveSelectedResponses = async () => {
        const queryResponseList = props.queryResponseList || [];
        console.log("queryResponseList " + queryResponseList)
        const responsesToSave = Array.from(selectedResponses).map(index => queryResponseList[index]) ;
        // Now, you can save 'responsesToSave' to the database
        console.log("responses to save " + responsesToSave)
        const savedFrameworks = await actions.queryResponseList.saveSelectedFrameworks(
            appContext.state.userState.userId,
            appContext.state.userState.constellationName,
            responsesToSave);
        console.log("saved Frameworks " + savedFrameworks)
        // set selected responses to empty
        setSelectedResponses(new Set());
    };

    return (
        <Stack>
            <Stack.Item tokens={stackItemPadding}>
                <form onSubmit={onFormSubmit}>
                    <TextField
                        borderless
                        iconProps={iconProps}
                        value={newQuery}
                        placeholder="Enter the name of a book or a link to an article"
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
                <button onClick={saveSelectedResponses}>{buttonName}</button>
            </Stack.Item>
        </Stack>
    );
}; 

export default QueryPane;