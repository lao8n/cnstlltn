import { Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useMemo, useRef } from "react";
import { canvasStackStyle, clusterButtonStyles, stackItemPadding } from '../ux/styles';
import { UserFramework, Cluster } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';
import { ActionTypes } from '../actions/common';
import { CanvasSpace, Circle, Pt } from "pts";
import { CnstlltnTheme } from "../ux/theme";

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

    useEffect(() => {
        const getCluster = async () => {
            const cluster = await actions.cluster.getCluster(appContext.state.userState.userId);
            appContext.dispatch({
                type: ActionTypes.SET_CLUSTER,
                cluster: cluster,
            });
            return cluster
        };
        getCluster();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions.cluster, appContext.dispatch]);

    const clusterBy = async () => {
        const clustered = await actions.constellation.cluster(appContext.state.userState.userId, clusterbyquery)
        console.log("clustered " + clustered)
    };

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                // Set the size of the canvas
                canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
                canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
                // Recalculate the positions based on new canvas size
                updatePositions();
                }
        };
        const space = new CanvasSpace(canvasRef.current || "").setup({ bgcolor: CnstlltnTheme.palette.black, resize: true });
        const form = space.getForm();
        let pts: Data[] = [];
        let cluster: Data[] = [];
        const updatePositions = () => {
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
        }
        space.add({
            start: (bound) => {
                updatePositions();
            },
            animate: (time, ftime) => {
                const r = 50;
                const range = Circle.fromCenter(space.pointer, r);
                for (let i = 0, len = pts?.length; i < len; i++) {
                    if (Circle.withinBound(range, pts[i].position)) {
                        const dist = (r - pts[i].position.$subtract(space.pointer).magnitude()) / r;
                        const p = pts[i].position.$subtract(space.pointer).scale(1 + dist).add(space.pointer);
                        form.fill("#fff").point(p, dist * 15, "circle");
                        form.font(dist * 15).fill("#fff").text(pts[i].position.$add(15, 15), pts[i].name);
                    } else {
                        form.fill("#fff").point(pts[i].position, 3, "circle");
                    }
                }
                for (let i = 0, len = cluster?.length; i < len; i++) {
                    form.font(15).fill("#fff").text(cluster[i].position, cluster[i].name)
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { // Check if the mouse click is released, which indicates a click
                    const mousePt = new Pt(x, y); // Create a Pt from the mouse position
                    const range = Circle.fromCenter(mousePt, r);
                    const topRightX = (canvasRef.current?.width || 0) - 100;
                    const topRightY = 20;
                    const topRight = new Pt(topRightX, topRightY);
                    console.log("clicked")
                    for (let i = 0, len = pts?.length; i < len; i++) {
                        if (Circle.withinBound(range, pts[i].position)) {
                            console.log(pts[i].description)
                            form.fill("#fff").text(topRight, cluster[i].name)
                            form.fill("#fff").text(topRight.$add(0, 15), pts[i].description);
                            break; // only print one thing
                        }
                    }
                    // Handle the click event, e.g., by drawing a circle at the click position
                    form.fillOnly("#123").circle([mousePt, 10]); // Draw a circle at the click position
                }
            }
        });
        space.bindMouse().bindTouch().play();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            space.stop();
        };
    }, [props.constellation, props.cluster]);

    return (
        <Stack grow={1} styles={canvasStackStyle}>
            <Stack horizontal>
                <Stack.Item tokens={stackItemPadding}>
                    <div>Constellation</div>
                </Stack.Item>
                <Stack.Item grow={1} />
                <Stack.Item>
                    <button
                        className={clusterButtonStyles}
                        onClick={clusterBy}>
                        Cluster
                    </button>
                </Stack.Item>
            </Stack>
            <Stack.Item grow={1} styles={canvasStackStyle}>
                <canvas ref={canvasRef} id="pt" style={{ width: '100%', height: '100%' }} />
            </Stack.Item>
        </Stack>
    );
}

export default ConstellationPane