import { IIconProps, Stack, TextField } from '@fluentui/react';
import React, { FC, ReactElement, useState, FormEvent } from "react";
import { queryFieldStyles, stackItemPadding } from '../ux/styles';
import { Query, QueryResponse } from '../models/queryState';

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

    const onNewQueryChange = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setNewQuery(value || '');
    }

    const onFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (newQuery) {
            props.onCreate({ userTxt: newQuery });
            setNewQuery('');
        }
    }

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
                    <p key={index}>{response.title}: {response.content}</p>
                ))}
            </Stack.Item>
        </Stack>
    );
}; 

export default QueryPane;