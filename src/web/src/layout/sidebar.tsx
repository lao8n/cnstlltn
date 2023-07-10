import React, { FC, ReactElement } from 'react';
import QueryPane from '../components/queryPane';

interface QueryPaneProps {
    query: string
    onQueryCreate: (query: string) => void
}

const Sidebar: FC<QueryPaneProps> = (props: QueryPaneProps): ReactElement => {
    return (
        <div>
            <QueryPane
                query={props.query}
                onCreate={props.onQueryCreate} />
        </div>
    );
};

export default Sidebar;