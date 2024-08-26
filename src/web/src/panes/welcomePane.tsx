// react imports
import { Stack } from "@fluentui/react";
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef, useCallback } from "react";
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
import { NoteActions } from '../state/actions/noteActions';
import * as noteActions from '../state/actions/noteActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// display imports
import { DisplayPoint } from "../frontend/models";
import { drawClusterPoints, drawConstellationPoints, setClusterDisplayPoints, setConstellationDisplayPoints, updatePositions } from "../frontend/display";
import { CanvasSpace, Circle, Pt } from "pts";
// ux imports
import { CnstlltnTheme } from "../ux/shared/theme";
import { welcomeCaptionStyle, welcomeStackStyle } from "../ux/panes/welcome";
import { canvasStackStyle, canvasStyle, stackItemPadding } from "../ux/shared/components";

const WelcomePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        cluster: bindActionCreators(clusterActions, appContext.dispatch) as unknown as ClusterActions,
        note: bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActions,
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

    // functions
    const updatePositionsCallback = useCallback(() => {
        updatePositions(canvasRef, constellationPts, clusterPts);
    }, []);

    // effects
    useEffect(() => {
        const getConstellationAndClusters = async () => {
            const constellation = await actions.constellation.getConstellation(
                userId,
                constellationName);
            const clusters = await actions.cluster.getClusters(
                userId,
                constellationName,
                clusterBy,
                true);
            actions.constellation.setConstellation(constellation);
            actions.cluster.setClusters(clusters);
            let count = 0;
            clusterPts.current = setClusterDisplayPoints(clusters, canvasRef);
            [constellationPts.current, count] = setConstellationDisplayPoints(
                constellation,
                clusters,
                canvasRef);
            setUnclusteredContent(count);
            updatePositionsCallback();
        }
        getConstellationAndClusters();
    }, [actions.constellation,
        actions.cluster,
        appContext.state.userState.updated,
        updatePositionsCallback]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const space = new CanvasSpace(canvas || "").setup({
            bgcolor: CnstlltnTheme.palette.black,
            resize: true
        });
        const form = space.getForm();
        space.add({
            start: (bound) => {
                updatePositionsCallback();
            },
            animate: (time, ftime) => {
                drawConstellationPoints(space, form, constellationPts);
                drawClusterPoints(form, clusterPts);
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { 
                    const mousePt = new Pt(x, y); 
                    const range = Circle.fromCenter(mousePt, r);
                    constellationPts.current.forEach(pt => {
                        if (Circle.withinBound(range, pt.position)) {
                            pt.selected = !pt.selected;
                            actions.note.setSelectedContent(pt.selected ? pt.userFramework : null)
                        }
                    });
                }
            }
        });
        space.bindMouse().bindTouch().play();
        const resizeObserver = new ResizeObserver(() => {
            updatePositionsCallback();
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
    }, [actions.note,
        actions.display,
        appContext.state.userState.selectedContent,
        updatePositionsCallback]);

    return (
        <Stack styles={welcomeStackStyle}>
            <Stack.Item styles={canvasStackStyle}>
                <canvas ref={canvasRef} style={canvasStyle} id="pt"/>
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                <div className={welcomeCaptionStyle}>
                    Tools for thinking
                </div>
            </Stack.Item>
        </Stack>
    )
}

export default WelcomePane