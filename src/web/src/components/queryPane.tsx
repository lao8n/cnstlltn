import { IIconProps, Stack, TextField } from '@fluentui/react';
import React, { FC, ReactElement, useState, FormEvent } from "react";
import { stackItemPadding } from '../ux/styles';

interface QueryPaneProps {
    query: string
    onCreate: (query: string) => void
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
            props.onCreate(newQuery);
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
                        placeholder="New List"
                        onChange={onNewQueryChange} />
                </form>
            </Stack.Item>
        </Stack>
    );
}; 

export default QueryPane;