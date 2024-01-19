import { Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useMemo, useRef } from "react";
import { clusterButtonStyles, stackItemPadding } from '../ux/styles';
import { UserFramework } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';
import { ActionTypes } from '../actions/common';
import { CanvasSpace, Circle, Pt } from "pts";
import { format } from 'path';

interface ConstellationPaneProps {
    constellation?: UserFramework[];
}

type Data = {
    name: string;
    description: string;
    position: Pt;
};

const ConstellationPane: FC<ConstellationPaneProps> = (props: ConstellationPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        constellation: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions
    }), [appContext.dispatch]);
    const clusterbyquery = "political, economic, sociological, technological, legal, environmental, psychological"
    const canvasRef = useRef<HTMLCanvasElement>(null); // Create a ref for the canvas

    useEffect(() => {
        const getConstellation = async () => {
            const constellation = await actions.constellation.getConstellation(appContext.state.userState.userId);
            constellation.forEach(framework => { console.log(framework) });
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

    useEffect(() => {
        if (canvasRef.current && canvasRef.current.parentElement) {
            const parent = canvasRef.current.parentElement;
            const width = parent.clientWidth;
            const height = parent.clientHeight;

            // Set the size of the canvas
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            const space = new CanvasSpace(canvasRef.current).setup({ bgcolor: "#123", resize: true });
            const form = space.getForm();
            let data: Data[] = [];
            space.add({
                start: (bound) => {
                    if (props.constellation) {
                        data = props.constellation.filter(framework => {
                            // Check if the framework has the necessary coordinate data
                            if (framework.clusterby[clusterbyquery] && 
                                   framework.clusterby[clusterbyquery].coordinate && 
                                framework.clusterby[clusterbyquery].coordinate.length >= 2) {
                                return true;
                            } else {
                                console.log(`Missing coordinate data for framework: ${framework.title} ${framework.clusterby[clusterbyquery]}`);
                                return false;
                            }
                        })
                        .map(framework => {
                            // Now we know that framework has valid coordinates
                            const x = framework.clusterby[clusterbyquery].coordinate[0] * (canvasRef.current?.width || 0);
                            const y = framework.clusterby[clusterbyquery].coordinate[1] * (canvasRef.current?.height || 0);
                            return {
                                name: framework.title,
                                description: framework.content,
                                position: new Pt(x, y),
                            };
                        });
                    }
                },
                animate: (time, ftime) => {
                    const r = Math.abs(space.pointer.x - space.center.x) / space.center.x * 150 + 70;
                    const range = Circle.fromCenter(space.pointer, r);
                    const colors = ["#ff2d5d", "#42dc8e", "#2e43eb", "#ffe359"]; // Define all colors
                    
                    for (let i = 0, len = data?.length; i < len; i++) {
                        if (Circle.withinBound(range, data[i].position)) {
                            const dist = (r - data[i].position.$subtract(space.pointer).magnitude()) / r;
                            const p = data[i].position.$subtract(space.pointer).scale(1 + dist).add(space.pointer);
                            form.fillOnly(colors[i % colors.length]).point(p, dist * 25, "circle");
                            form.fill("#fff").text(data[i].position.$add(15, 15), data[i].name)
                        } else {
                            form.fillOnly("#fff").point(data[i].position, 0.5);
                        }
                    }
                }
            });

            space.bindMouse().bindTouch().play();
        }
    }, [props.constellation]);

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
                <canvas ref={canvasRef} id="pt" />
            </Stack.Item>
        </Stack>
    )
}

export default ConstellationPane