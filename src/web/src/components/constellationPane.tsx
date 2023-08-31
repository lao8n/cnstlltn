import { Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect } from "react";
import { UserFramework } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';

interface ConstellationPaneProps {
    constellation?: UserFramework[];
}

const ConstellationPane: FC<ConstellationPaneProps> = (props: ConstellationPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = {      
        constellation: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getConstellation = async () => {
        const constellation = await actions.constellation.getConstellation();
        console.log("constellation " + constellation)
        return constellation
    }

    useEffect(() => {
        getConstellation();
    }, [getConstellation, appContext.state.queryState?.responses]);

    return (
        <Stack>
            <Stack.Item>
                {props.constellation?.map((constellation, index) => (
                    <div key={index}>
                        {constellation}
                    </div>
                ))}
            </Stack.Item>
        </Stack>
    )
}

export default ConstellationPane