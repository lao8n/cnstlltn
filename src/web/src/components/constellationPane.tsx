import { Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useMemo } from "react";
import { clusterButtonStyles, stackItemPadding } from '../ux/styles';
import { UserFramework } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';
import { ActionTypes } from '../actions/common';

interface ConstellationPaneProps {
    constellation?: UserFramework[];
}

const ConstellationPane: FC<ConstellationPaneProps> = (props: ConstellationPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({      
        constellation: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
    }), [appContext.dispatch]);
    const clusterbyquery = "political, economic, sociological, technological, legal, environmental"

    useEffect(() => {
        const getConstellation = async () => {
            const constellation = await actions.constellation.getConstellation(appContext.state.userState.userId);
            console.log("constellation " + constellation)
            appContext.dispatch({
                type: ActionTypes.SET_CONSTELLATION,
                constellation: constellation,
            });
            return constellation
        };
        getConstellation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions.constellation, appContext.dispatch]);

    const clusterBy = async () => {
        const clustered = await actions.constellation.cluster(appContext.state.userState.userId, clusterbyquery)
        console.log("clustered " + clustered)
    };

    return (
        <Stack>
            <Stack horizontal>
                <Stack.Item tokens={stackItemPadding}>
                    <div>Constellation</div>
                </Stack.Item>
                <Stack.Item>
                    <button
                        className={clusterButtonStyles}
                        onClick={clusterBy}>
                        Cluster
                    </button>
                </Stack.Item>
            </Stack>
            <Stack.Item>
                {props.constellation?.map((constellation, index) => (
                    <div key={index}>
                        {constellation.title}: {constellation.content} - {constellation.clusterby[clusterbyquery].cluster} - {constellation.clusterby[clusterbyquery].coordinates}
                    </div>
                ))}
            </Stack.Item>
        </Stack>
    )
}

export default ConstellationPane