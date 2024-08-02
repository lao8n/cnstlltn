import { Stack, TextField } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef, useCallback, FormEvent } from "react";
import { canvasStackStyle, clusterByStyle, stackItemPadding, constellationNameStyle, clusterByWordStyle } from '../ux/styles';
import { UserFramework, Cluster } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';
import { ActionTypes } from '../actions/common';
import { CanvasSpace, Circle, Pt, CanvasForm } from "pts";
import { CnstlltnTheme } from "../ux/theme";

type Data = {
    name: string;
    description: string;
    coord: [number, number];
    position: Pt;
    selected: boolean;
};

const ConstellationPane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        constellation: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        cluster: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
    }), [appContext.dispatch]);
    const canvasRef = useRef<HTMLCanvasElement>(null); // Create a ref for the canvas
    const pts = useRef<Data[]>([]) as React.MutableRefObject<Data[]>;
    const clusters = useRef<Data[]>([]) as React.MutableRefObject<Data[]>;
    const [lastSelected, setLastSelected] = useState<Data | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
    const [constellationRedrawn, setConstellationRedrawn] = useState(Date.now());
    const redrawConstellation = useCallback(() => {
        setConstellationRedrawn(Date.now());
    }, []);
    const [newQuery, setNewQuery] = useState('');

    const onNewQueryChange = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        setNewQuery(value || appContext.state.userState.clusterBy);
        // TODO: actually do an action to update clusterby field in user state
    }

    // 1. createConstellation
    // 2. saveSelectedResponses
    // 3. clusterBy
    // -> 
    // 1. userState.updated
    // -> 
    // 1. getConstellation 
    // 2. getCluster
    // -> 
    // 1. initializeConstellation
    // 2. initializeCluster
    // -> 
    // 1. redrawConstellation
    useEffect(() => {
        console.log("get constellation")
        const getConstellation = async () => {
            const constellation = await actions.constellation.getConstellation(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName);
            appContext.dispatch({
                type: ActionTypes.SET_CONSTELLATION,
                constellation: constellation,
            });
            return constellation
        };
        getConstellation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions.constellation, appContext.dispatch, appContext.state.userState.userId, appContext.state.userState.constellationName, appContext.state.userState.updated]);

    useEffect(() => {
        pts.current = initializeConstellation(
            appContext.state.userState.constellation,
            appContext.state.userState.clusterBy,
            canvasRef);
        redrawConstellation();
    }, [appContext.state.userState.constellation, appContext.state.userState.clusterBy, redrawConstellation])

    useEffect(() => {
        console.log("get cluster")
        const getCluster = async () => {
            const cluster = await actions.cluster.getCluster(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                appContext.state.userState.clusterBy);
            appContext.dispatch({
                type: ActionTypes.SET_CLUSTER,
                cluster: cluster,
            });
            return cluster
        };
        getCluster();
        redrawConstellation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions.cluster, appContext.dispatch,
    appContext.state.userState.userId,
    appContext.state.userState.constellationName,
    appContext.state.userState.clusterBy,
    appContext.state.userState.updated]);

    useEffect(() => {
        clusters.current = initializeCluster(appContext.state.userState.cluster, canvasRef);
        redrawConstellation();
    }, [appContext.state.userState.cluster, redrawConstellation])

    const onFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        console.log("cluster")
        actions.constellation.cluster(
            appContext.state.userState.userId,
            appContext.state.userState.constellationName,
            appContext.state.userState.clusterBy)
        appContext.dispatch({
            type: ActionTypes.SET_UPDATED,
            updated: Date.now(),
        });
    }

    useEffect(() => {
        const space = new CanvasSpace(canvasRef.current || "").setup({ bgcolor: CnstlltnTheme.palette.black, resize: true });
        const form = space.getForm();
        const maxDimensions = { width: 1200, height: 800 }
        const handleResize = () => {
            console.log("resizing to: ", canvasRef.current?.parentElement?.clientWidth, canvasRef.current?.parentElement?.clientHeight)
            if (canvasRef.current?.parentElement) {
                const newWidth = Math.min(canvasRef.current.parentElement.clientWidth, maxDimensions.width)
                const newHeight = Math.min(canvasRef.current.parentElement.clientHeight, maxDimensions.height)
                setDimensions({ width: newWidth, height: newHeight })
                // Recalculate the positions based on new canvas size
                updatePositions();
                // console.log("update canvas:", dimensions.width, dimensions.height);
            }
        };
        const updatePositions = () => {
            pts.current.forEach(pt => {
                const x = pt.coord[0] * (dimensions.width || 0);
                const y = pt.coord[1] * (dimensions.height || 0);
                pt.position = new Pt(x, y);
            })
            clusters.current.forEach(pt => {
                const x = pt.coord[0] * (dimensions.width || 0);
                const y = pt.coord[1] * (dimensions.height || 0);
                pt.position = new Pt(x, y);
            })
        }
        space.add({
            start: (bound) => {
                console.log("starting position: ", dimensions.width, dimensions.height)
                updatePositions();
            },
            animate: (time, ftime) => {
                const r = 50;
                const range = Circle.fromCenter(space.pointer, r);
                pts.current.forEach(pt => {
                    const colour = pt.selected ? "#ff0" : "#fff";
                    if (Circle.withinBound(range, pt.position)) {
                        const dist = (r - pt.position.$subtract(space.pointer).magnitude()) / r;
                        const p = pt.position.$subtract(space.pointer).scale(1 + dist).add(space.pointer);
                        form.fill(colour).point(p, dist * 15, "circle");
                        form.font(dist * 15).fill("#fff").text(pt.position.$add(15, 15), pt.name);
                    } else {
                        form.fill(colour).point(pt.position, 3, "circle");
                    }
                });
                clusters.current.forEach(cluster => {
                    form.font(15).fill("#fff").text(cluster.position, cluster.name);
                });
                if (lastSelected) {
                    const topRightX = (canvasRef.current?.width || 0) - 500;
                    const topRightY = 20;
                    const topRight = new Pt(topRightX, topRightY);
                    form.font(15).fill("#fff").text(topRight, lastSelected.name);
                    drawMultiLineText(form, topRight.$add(0, 15), lastSelected.description, 15, 400);
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { // Check if the mouse click is released, which indicates a click
                    const mousePt = new Pt(x, y); // Create a Pt from the mouse position
                    const range = Circle.fromCenter(mousePt, r);
                    pts.current.forEach(pt => {
                        if (Circle.withinBound(range, pt.position)) {
                            if (appContext.state.userState.constellationName === "Home") {
                                console.log("constellation set to ", pt.name)
                                appContext.dispatch({
                                    type: ActionTypes.SET_CONSTELLATION_NAME,
                                    constellationName: pt.name,
                                });
                            } else {
                                console.log("constellation name", appContext.state.userState.constellationName)
                                pt.selected = !pt.selected;
                                setLastSelected(pt.selected ? pt : null)
                                console.log("select: ", pt.name, lastSelected?.name);
                            }
                        }
                    });
                }
            }
        });
        space.bindMouse().bindTouch().play();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            space.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSelected, dimensions, pts, clusters, appContext.dispatch, appContext.state.userState.constellationName, constellationRedrawn]);

    return (
        <Stack grow={1}>
            <Stack horizontal grow={0}>
                <Stack.Item grow={1} tokens={stackItemPadding}>
                    <div className={constellationNameStyle}>
                        {appContext.state.userState.constellationName}
                    </div>
                </Stack.Item>
                <Stack.Item styles={clusterByStyle} tokens={stackItemPadding}>
                    <Stack horizontal>
                        <div className={clusterByWordStyle}>
                            {"Cluster by:&nbsp;&nbsp;&nbsp;"}
                        </div>
                        <form onSubmit={onFormSubmit}>
                            <TextField
                                value={newQuery}
                                placeholder={appContext.state.userState.clusterBy}
                                onChange={onNewQueryChange}
                                styles={clusterByStyle}
                            />
                        </form>
                    </Stack>
                </Stack.Item>
            </Stack>
            <Stack.Item grow={1} styles={canvasStackStyle}>
                <canvas ref={canvasRef} id="pt"/>
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

function drawMultiLineText(form : CanvasForm, startingPoint : Pt, text : string, lineHeight : number, maxWidth: number) {
    const words = text.split(' ');
    let line = '';
    let y = startingPoint.y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = form.getTextWidth(testLine);
        if (testWidth > maxWidth && i > 0) {
            form.font(12).fill("#fff").text(new Pt(startingPoint.x, y), line);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    form.font(12).fill("#fff").text(new Pt(startingPoint.x, y), line); // Render the last line
}

export default ConstellationPane