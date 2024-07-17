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
    coord: [number, number];
    position: Pt;
    selected: boolean;
};

const ConstellationPane: FC<ConstellationPaneProps> = (props: ConstellationPaneProps): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        constellation: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        cluster: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
    }), [appContext.dispatch]);
    const clusterbyquery = "political, economic, sociological, technological, legal, environmental, psychological"
    const canvasRef = useRef<HTMLCanvasElement>(null); // Create a ref for the canvas
    const pts = useRef<Data[]>([]) as React.MutableRefObject<Data[]>;
    const cluster = useRef<Data[]>([])  as React.MutableRefObject<Data[]>;
    const lastSelected = useRef<Data|null>(null) as React.MutableRefObject<Data|null>;
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
        if (props.constellation) {
            pts.current = initializeConstellation(props.constellation, clusterbyquery, canvasRef);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.constellation, actions.constellation, appContext.dispatch]);

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
        if (props.cluster) {
            cluster.current = initializeCluster(props.cluster, canvasRef);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cluster, actions.cluster, appContext.dispatch]);

    const clusterBy = async () => {
        const clustered = await actions.constellation.cluster(appContext.state.userState.userId, clusterbyquery)
        console.log("clustered " + clustered)
    };

    useEffect(() => {
        const handleResize = () => {
            console.log("resizing to: ", canvasRef.current?.parentElement?.clientWidth, canvasRef.current?.parentElement?.clientHeight)
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
        const updatePositions = () => {
            console.log("update canvas:", canvasRef.current?.width, canvasRef.current?.height);
            pts.current.forEach(pt => {
                const x = pt.coord[0] * (canvasRef.current?.width || 0);
                const y = pt.coord[1] * (canvasRef.current?.height || 0);
                pt.position = new Pt(x, y);
            })
            cluster.current.forEach(pt => {
                const x = pt.coord[0] * (canvasRef.current?.width || 0);
                const y = pt.coord[1] * (canvasRef.current?.height || 0);
                pt.position = new Pt(x, y);
            })
        }
        space.add({
            start: (bound) => {
                updatePositions();
            },
            animate: (time, ftime) => {
                const r = 50;
                const range = Circle.fromCenter(space.pointer, r);
                for (let i = 0, len = pts.current?.length; i < len; i++) {
                    let colour = "#fff"
                    if (pts.current[i].selected) {
                        colour = "#ff0"
                    }
                    if (Circle.withinBound(range, pts.current[i].position)) {
                        const dist = (r - pts.current[i].position.$subtract(space.pointer).magnitude()) / r;
                        const p = pts.current[i].position.$subtract(space.pointer).scale(1 + dist).add(space.pointer);
                        form.fill(colour).point(p, dist * 15, "circle");
                        form.font(dist * 15).fill("#fff").text(pts.current[i].position.$add(15, 15), pts.current[i].name);
                    } else {
                        form.fill(colour).point(pts.current[i].position, 3, "circle");
                    }
                }
                for (let i = 0, len = cluster.current?.length; i < len; i++) {
                    form.font(15).fill("#fff").text(cluster.current[i].position, cluster.current[i].name)
                }
                if (lastSelected.current !== null) {
                    const topRightX = (canvasRef.current?.width || 0) - 100;
                    const topRightY = 20;
                    const topRight = new Pt(topRightX, topRightY);
                    form.font(15).fill("#fff").text(topRight, lastSelected.current.name)
                    form.font(12).fill("#fff").text(topRight.$add(0, 15), lastSelected.current.description);
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { // Check if the mouse click is released, which indicates a click
                    const mousePt = new Pt(x, y); // Create a Pt from the mouse position
                    const range = Circle.fromCenter(mousePt, r);
                    for (let i = 0, len = pts.current?.length; i < len; i++) {
                        if (Circle.withinBound(range, pts.current[i].position)) {
                            if (lastSelected.current?.name === pts.current[i].name) {
                                lastSelected.current = null;
                            } 
                            pts.current[i].selected = !pts.current[i].selected;

                        }
                    }
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

function initializeConstellation(constellation: UserFramework[], clusterbyQuery: string, canvasRef: React.RefObject<HTMLCanvasElement>): Data[] {
    return constellation.filter(framework => {
        // Check if the framework has the necessary coordinate data
        if (framework.clusterby[clusterbyQuery] &&
            framework.clusterby[clusterbyQuery].coordinate &&
            framework.clusterby[clusterbyQuery].coordinate.length >= 2) {
            return true;
        } else {
            console.log(`Missing coordinate data for framework: ${framework.title} ${framework.clusterby[clusterbyQuery]}`);
            return false;
        }
    }).map(framework => {
        // Now we know that framework has valid coordinates
        const cx = framework.clusterby[clusterbyQuery].coordinate[0]
        const cy = framework.clusterby[clusterbyQuery].coordinate[1]
        const x = cx * (canvasRef.current?.width || 0);
        const y = cy * (canvasRef.current?.height || 0);
        return {
            name: framework.title,
            description: framework.content,
            coord: [cx, cy],
            position: new Pt(x, y),
            selected: false,
        };
    });
}

function initializeCluster(cluster: Cluster[], canvasRef: React.RefObject<HTMLCanvasElement>): Data[] {
    return cluster.map(cluster => {
        const cx = cluster.coordinate[0]
        const cy = cluster.coordinate[1]
        const x = cx * (canvasRef.current?.width || 0);
        const y = cy * (canvasRef.current?.height || 0);
        return {
            name: cluster.cluster,
            description: "",
            coord: [cx, cy],
            position: new Pt(x, y),
            selected: false,
        };
    })
}

export default ConstellationPane