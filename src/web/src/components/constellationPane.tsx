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

interface ConstellationPaneProps {
    constellation?: UserFramework[];
}

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

    useEffect(() => {
        if (canvasRef.current) {
            const space = new CanvasSpace(canvasRef.current).setup({ bgcolor: "#123" });
            const form = space.getForm();
            let pts : Pt[] = [];

            space.add({
                start: (bound) => {
                    if (props.constellation) {
                        pts = props.constellation.filter(framework => {
                            // Check if the framework has the necessary coordinate data
                            if (framework.clusterby[clusterbyquery] && 
                                   framework.clusterby[clusterbyquery].coordinates && 
                                framework.clusterby[clusterbyquery].coordinates.length >= 2) {
                                return true;
                            } else {
                                console.log(`Missing coordinate data for framework: ${framework.title}`);
                                return false;
                            }
                        })
                        .map(framework => {
                            // Now we know that framework has valid coordinates
                            return new Pt(framework.clusterby[clusterbyquery].coordinates[0], framework.clusterby[clusterbyquery].coordinates[1]);
                        });
                    }
                },
                animate: (time, ftime) => {
                    const r = Math.abs(space.pointer.x - space.center.x) / space.center.x * 150 + 70;
                    const range = Circle.fromCenter(space.pointer, r);
                    const colors = ["#ff2d5d", "#42dc8e", "#2e43eb", "#ffe359"]; // Define all colors
                    
                    for (let i = 0, len = pts?.length; i < len; i++) {
                        if (Circle.withinBound(range, pts[i])) {
                            const dist = (r - pts[i].$subtract(space.pointer).magnitude()) / r;
                            const p = pts[i].$subtract(space.pointer).scale(1 + dist).add(space.pointer);
                            form.fillOnly(colors[i % colors.length]).point(p, dist * 25, "circle");
                        } else {
                            form.fillOnly("#fff").point(pts[i], 0.5);
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