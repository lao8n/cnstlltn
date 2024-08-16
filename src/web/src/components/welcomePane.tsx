// react imports
import { Stack } from "@fluentui/react";
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef } from "react";
// ux imports
import { canvasStackStyle, welcomeLineStyle } from "../ux/styles";
// state imports
import { AppContext } from "../state/applicationState";
import UserAppContext from "./userContext";
import { bindActionCreators } from "../actions/actionCreators";
import { UserActions } from '../actions/userActions';
import * as userActions from '../actions/userActions';
import { ConstellationActions } from '../actions/constellationActions';
import * as constellationActions from '../actions/constellationActions';
import { ClusterActions } from '../actions/clusterActions';
import * as clusterActions from '../actions/clusterActions';
import { DisplayActions } from '../actions/displayActions';
import * as displayActions from '../actions/displayActions';
// display imports
import { DisplayPoint } from "../display/models";
import { drawClusterPoints, drawConstellationPoints, drawMultiLineText, setClusterDisplayPoints, setConstellationDisplayPoints } from "../display/display";
import { CanvasSpace, Circle, Pt } from "pts";
import { CnstlltnTheme } from "../ux/theme";

const WelcomePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        cluster: bindActionCreators(clusterActions, appContext.dispatch) as unknown as ClusterActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);

    // hard-coded info
    const userId = "welcome_user";
    const constellationName = "welcome_constellation";
    const clusterBy = "welcome_cluster_by"

    // display
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const constellationPts = useRef<DisplayPoint[]>([]) as React.MutableRefObject<DisplayPoint[]>;
    const clusterPts = useRef<DisplayPoint[]>([]) as React.MutableRefObject<DisplayPoint[]>;
    const [, setUnclusteredContent] = useState(0);

    // effects
    useEffect(() => {
        console.log("get constellation")
        const getConstellation = async () => {
            const constellation = await actions.constellation.getConstellation(
                userId,
                constellationName);
            console.log(constellation)
            actions.constellation.setConstellation(constellation);
        };
        getConstellation();
    }, [actions.constellation,
        appContext.state.userState.updated]);
    
    useEffect(() => {
        console.log("get cluster")
        const getCluster = async () => {
            const clusters = await actions.cluster.getClusters(
                userId,
                constellationName,
                clusterBy,
                true);
            console.log(clusters)
            actions.cluster.setClusters(clusters);
            // this is the case that we have gotten the latest clustering
        };
        getCluster();
    }, [actions.cluster,
        appContext.state.userState.updated]);
    
    useEffect(() => {
        console.log("set constellation display points")
        console.log(appContext.state.userState.constellation)
        constellationPts.current = setConstellationDisplayPoints(
            appContext.state.userState.constellation,
            appContext.state.userState.clusters,
            canvasRef,
            setUnclusteredContent);
        console.log(constellationPts.current)
    }, [appContext.state.userState.constellation, appContext.state.userState.clusters])

    useEffect(() => {
        console.log("set cluster display points")
        console.log(appContext.state.userState.clusters)
        clusterPts.current = setClusterDisplayPoints(appContext.state.userState.clusters, canvasRef);
        console.log(clusterPts.current)
    }, [appContext.state.userState.clusters])
    
    useEffect(() => {
        const space = new CanvasSpace(canvasRef.current || "").setup({ bgcolor: CnstlltnTheme.palette.black, resize: true });
        const form = space.getForm();
        const maxDimensions = { width: 2000, height: 1200 }
        const handleResize = () => {
            console.log("resizing to: ", canvasRef.current?.parentElement?.clientWidth, canvasRef.current?.parentElement?.clientHeight)
            if (canvasRef.current?.parentElement) {
                const newWidth = Math.min(canvasRef.current.parentElement.clientWidth, maxDimensions.width)
                const newHeight = Math.min(canvasRef.current.parentElement.clientHeight, maxDimensions.height)
                console.log("set dimensions: ", newWidth, newHeight)
                setDimensions({ width: newWidth, height: newHeight })
                updatePositions();
            }
        };
        const updatePositions = () => {
            constellationPts.current.forEach(pt => {
                const x = pt.coord[0] * (dimensions.width || 0);
                const y = pt.coord[1] * (dimensions.height || 0);
                pt.position = new Pt(x, y);
            })
            clusterPts.current.forEach(pt => {
                const x = pt.coord[0] * (dimensions.width || 0);
                const y = pt.coord[1] * (dimensions.height || 0);
                pt.position = new Pt(x, y);
            })
        }
        space.add({
            start: (bound) => {
                setDimensions({width: canvasRef.current?.width || 0, height: canvasRef.current?.height || 0})
                updatePositions();
            },
            animate: (time, ftime) => {
                drawConstellationPoints(space, form, constellationPts);
                drawClusterPoints(form, clusterPts);
                if (appContext.state.userState.selectedContent !== null) {
                    drawMultiLineText(form, canvasRef.current?.width || 0, appContext.state.userState.selectedContent, 15, 400);
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { 
                    const mousePt = new Pt(x, y); 
                    const range = Circle.fromCenter(mousePt, r);
                    constellationPts.current.forEach(pt => {
                        if (Circle.withinBound(range, pt.position)) {
                            pt.selected = !pt.selected;
                            actions.display.setSelectedContent(pt.selected ? pt : null)
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
    }, [actions.display,
        dimensions,
        appContext.state.userState.selectedContent]);

    return (
        <Stack>
            <div className={welcomeLineStyle}>
                Tools for thinking
            </div>
            <Stack.Item grow={1} styles={canvasStackStyle}>
                <canvas ref={canvasRef} id="pt"/>
            </Stack.Item>
        </Stack>
    )
}

export default WelcomePane