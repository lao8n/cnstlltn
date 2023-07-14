import React, { FC, ReactElement } from 'react';
import QueryPane from '../components/queryPane';
import { Query } from '../models/queryState';

interface QueryPaneProps {
    query?: Query
    onQueryCreate: (query: Query) => void
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