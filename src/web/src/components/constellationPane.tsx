import { Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef } from "react";
import { canvasStackStyle, clusterButtonStyles, stackItemPadding } from '../ux/styles';
import { UserFramework, Cluster } from "../models/userState";
import { AppContext } from "../models/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import * as userActions from '../actions/userActions';
import { UserActions } from '../actions/userActions';
import { ActionTypes } from '../actions/common';
import { CanvasSpace, Circle, Pt, CanvasForm } from "pts";
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
    const clusters = useRef<Data[]>([]) as React.MutableRefObject<Data[]>;
    const [lastSelected, setLastSelected] = useState<Data | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 })
    useEffect(() => {
        const getConstellation = async () => {
            const constellation = await actions.constellation.getConstellation(appContext.state.userState.userId);
            // constellation.forEach(framework => { console.log(framework) });
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
        if (props.constellation) {
            pts.current = initializeConstellation(props.constellation, clusterbyquery, canvasRef);
        }
    }, [props.constellation])

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

    useEffect(() => {
        if (props.cluster) {
            clusters.current = initializeCluster(props.cluster, canvasRef);
        }
    }, [props.cluster])

    const clusterBy = async () => {
        const clustered = await actions.constellation.cluster(appContext.state.userState.userId, clusterbyquery)
        console.log("clustered " + clustered)
    };

    useEffect(() => {
        const space = new CanvasSpace(canvasRef.current || "").setup({ bgcolor: CnstlltnTheme.palette.black, resize: true });
        const form = space.getForm();
        const maxDimensions = {width: 1200, height: 800}
        const handleResize = () => {
            console.log("resizing to: ", canvasRef.current?.parentElement?.clientWidth, canvasRef.current?.parentElement?.clientHeight)
            if (canvasRef.current?.parentElement) {
                const newWidth = Math.min(canvasRef.current.parentElement.clientWidth, maxDimensions.width)
                const newHeight = Math.min(canvasRef.current.parentElement.clientHeight, maxDimensions.height)
                setDimensions({width: newWidth, height: newHeight})
                // Recalculate the positions based on new canvas size
                updatePositions();
                console.log("update canvas:", dimensions.width, dimensions.height);
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
                        if (Circle.withinBound(range, pt.position)){
                            pt.selected = !pt.selected;
                            setLastSelected(pt.selected ? pt : null)
                            console.log("select: ", pt.name, lastSelected?.name);
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
    }, [lastSelected, dimensions]);

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
                <canvas ref={canvasRef} id="pt" style={{ width: dimensions.width, height: dimensions.height }} />
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