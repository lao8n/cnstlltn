import React, { FC, ReactElement, useContext } from 'react';
import QueryPane from '../components/queryPane';
import { Query } from '../models/queryState';
import { AppContext } from '../models/applicationState';
import UserAppContext from '../components/userContext';

interface QueryPaneProps {
    query?: Query
    onQueryCreate: (query: Query) => void
}

const Sidebar: FC<QueryPaneProps> = (props: QueryPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext);
    return (
        <div>
            console.log("sidebar ", appContext.state.queryState.responses)
            <QueryPane
                query={props.query}
                queryResponseList={appContext.state.queryState.responses}
                onCreate={props.onQueryCreate} />
        </div>
    );
};

export default Sidebar;