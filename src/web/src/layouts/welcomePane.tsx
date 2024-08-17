// react imports
import { Stack } from "@fluentui/react";
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef } from "react";
// state imports
import { AppContext } from "../state/applicationState";
import UserAppContext from "../state/userContext";
import { bindActionCreators } from "../state/actions/actionCreators";
import { UserActions } from '../state/actions/userActions';
import * as userActions from '../state/actions/userActions';
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { ClusterActions } from '../state/actions/clusterActions';
import * as clusterActions from '../state/actions/clusterActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// ux imports
import { welcomeStackStyle, welcomeLineStyle } from "../ux/welcome";
import { canvasStackStyle, canvasStyle } from "../ux/components";
// display imports
import { DisplayPoint } from "../frontend/models";
import { drawClusterPoints, drawConstellationPoints, drawMultiLineText, setClusterDisplayPoints, setConstellationDisplayPoints } from "../frontend/display";
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
        const canvas = canvasRef.current;
        const space = new CanvasSpace(canvas || "").setup({
            bgcolor: CnstlltnTheme.palette.black,
            resize: true
        });
        const form = space.getForm();
        const updatePositions = () => {
            console.log("update positions:", canvas?.parentElement?.clientWidth, canvas?.parentElement?.clientHeight)
            constellationPts.current.forEach(pt => {
                const x = pt.coord[0] * (canvas?.parentElement?.clientWidth || 0);
                const y = pt.coord[1] * (canvas?.parentElement?.clientHeight || 0);
                pt.position = new Pt(x, y);
            })
            clusterPts.current.forEach(pt => {
                const x = pt.coord[0] * (canvas?.parentElement?.clientWidth || 0);
                const y = pt.coord[1] * (canvas?.parentElement?.clientHeight || 0);
                pt.position = new Pt(x, y);
            })
        }
        space.add({
            start: (bound) => {
                updatePositions();
            },
            animate: (time, ftime) => {
                drawConstellationPoints(space, form, constellationPts);
                drawClusterPoints(form, clusterPts);
                if (appContext.state.userState.selectedContent !== null) {
                    drawMultiLineText(form, canvas?.width || 0, appContext.state.userState.selectedContent, 15, 400);
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { 
                    const mousePt = new Pt(x, y); 
                    const range = Circle.fromCenter(mousePt, r);
                    constellationPts.current.forEach(pt => {
                        if (Circle.withinBound(range, pt.position)) {
                            console.log("clicked:", pt.name);
                            pt.selected = !pt.selected;
                            actions.display.setSelectedContent(pt.selected ? pt : null)
                        }
                    });
                }
            }
        });
        space.bindMouse().bindTouch().play();
        const resizeObserver = new ResizeObserver(() => {
            updatePositions();
        });
        if (canvas?.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }
        return () => {
            if (canvas?.parentElement) {
                resizeObserver.unobserve(canvas?.parentElement);
            }
            space.stop();
        };
    }, [actions.display,
        appContext.state.userState.selectedContent]);

    return (
        <Stack styles={welcomeStackStyle}>
            <div className={welcomeLineStyle}>
                Tools for thinking
            </div>
            <Stack.Item styles={canvasStackStyle}>
                <canvas ref={canvasRef} style={canvasStyle} id="pt"/>
            </Stack.Item>
        </Stack>
    )
}

export default WelcomePane