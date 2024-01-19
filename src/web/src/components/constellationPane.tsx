import { Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useMemo, useRef } from "react";
import { clusterButtonStyles, stackItemPadding } from '../ux/styles';
import { UserFramework, Cluster } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';
import { ActionTypes } from '../actions/common';
import { CanvasSpace, Circle, Pt } from "pts";

interface ConstellationPaneProps {
    constellation?: UserFramework[];
    cluster?: Cluster[];
}

type Data = {
    name: string;
    description: string;
    position: Pt;
};

const ConstellationPane: FC<ConstellationPaneProps> = (props: ConstellationPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        constellation: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        cluster: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
    }), [appContext.dispatch]);
    const clusterbyquery = "political, economic, sociological, technological, legal, environmental, psychological"
    const canvasRef = useRef<HTMLCanvasElement>(null); // Create a ref for the canvas

    useEffect(() => {
        const getConstellationCluster = async () => {
            const constellationcluster = await actions.constellation.getConstellationCluster(appContext.state.userState.userId);
            constellationcluster[0].forEach(framework => { console.log(framework) });
            appContext.dispatch({
                type: ActionTypes.SET_CONSTELLATION,
                constellation: constellationcluster[0],
            });
            appContext.dispatch({
                type: ActionTypes.SET_CLUSTER,
                cluster: constellationcluster[1],
            });
            return constellationcluster
        };
        getConstellationCluster();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions.constellation, actions.cluster, appContext.dispatch]);

    const clusterBy = async () => {
        const clustered = await actions.constellation.cluster(appContext.state.userState.userId, clusterbyquery)
        console.log("clustered " + clustered)
    };

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const parent = canvasRef.current.parentElement;
                const width = parent.clientWidth;
                const height = parent.clientHeight;

                // Set the size of the canvas
                canvasRef.current.width = width;
                canvasRef.current.height = height;

                const space = new CanvasSpace(canvasRef.current).setup({ bgcolor: "#123", resize: true });
                const form = space.getForm();
                let pts: Data[] = [];
                let cluster: Data[] = [];
                space.add({
                    start: (bound) => {
                        if (props.constellation) {
                            pts = props.constellation.filter(framework => {
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
                        if (props.cluster) {
                            cluster = props.cluster.map(cluster => {
                                const x = cluster.coordinate[0] * (canvasRef.current?.width || 0);
                                const y = cluster.coordinate[1] * (canvasRef.current?.height || 0);
                                return {
                                    name: cluster.cluster,
                                    description: "",
                                    position: new Pt(x, y),
                                };
                            })
                        }
                    },
                    animate: (time, ftime) => {
                        const r = Math.abs(space.pointer.x - space.center.x) / space.center.x * 150 + 70;
                        const range = Circle.fromCenter(space.pointer, r);
                        for (let i = 0, len = pts?.length; i < len; i++) {
                            if (Circle.withinBound(range, pts[i].position)) {
                                const dist = (r - pts[i].position.$subtract(space.pointer).magnitude()) / r;
                                const p = pts[i].position.$subtract(space.pointer).scale(1 + dist).add(space.pointer);
                                form.point(p, dist * 25, "circle");
                                form.fill("#fff").text(pts[i].position.$add(15, 15), pts[i].name)
                            } else {
                                form.fillOnly("#fff").point(pts[i].position, 0.5);
                            }
                        }
                        for (let i = 0, len = cluster?.length; i < len; i++) {
                            form.fill("#fff").text(cluster[i].position, cluster[i].name)
                        }
                    }
                });

                space.bindMouse().bindTouch().play();
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [props.constellation, props.cluster]);

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