// react imports
import { SearchBox, Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef, useCallback, FormEvent, ChangeEvent } from "react";
// ux imports
import { canvasStackStyle, clusterByStyle, stackItemPadding, constellationNameStyle, clusterByWordStyle } from '../ux/styles';
import { CnstlltnTheme } from "../ux/theme";
// state imports
import { AppContext } from "../models/applicationState";
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
import { CanvasSpace, Circle, Pt } from "pts";
import { DisplayPoint } from '../display/models';
import { setConstellationDisplayPoints, setClusterDisplayPoints, drawMultiLineText, drawConstellationPoints, drawClusterPoints, drawUnclusteredContentNotification } from '../display/display';

// Update path
// 1. createConstellation   -> userState.updated -> getConstellation -> setConstellationDisplayPoints -> redrawConstellation
//    saveSelectedResponses                         getCluster          setClusterDisplayPoints
//    clusterBy
const ConstellationPane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        user: bindActionCreators(userActions, appContext.dispatch) as unknown as UserActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        cluster: bindActionCreators(clusterActions, appContext.dispatch) as unknown as ClusterActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);

    // display
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1500, height: 800 })
    const constellationPts = useRef<DisplayPoint[]>([]) as React.MutableRefObject<DisplayPoint[]>;
    const clusterPts = useRef<DisplayPoint[]>([]) as React.MutableRefObject<DisplayPoint[]>;
    const [lastSelected, setLastSelected] = useState<DisplayPoint | null>(null);
    const [constellationRedrawn, setConstellationRedrawn] = useState(Date.now());
    const [unclusteredContent, setUnclusteredContent] = useState(0);
    const [clusterBy, setNewClusterBy] = useState('');
    const [clusterByOptions, setNewClusterByOptions] =  useState<string[]>([]);

    // functions
    const redrawConstellation = useCallback(() => {
        setConstellationRedrawn(Date.now());
    }, []);
    const onTypeClusterByChange = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        console.log("onTypeClusterByChange: ", newValue)
        setNewClusterBy(newValue || appContext.state.userState.clusterBy);
    }

    const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
        console.log("drop down change: ", event.target.value);
        setNewClusterBy(event.target.value);
    };

    const onSearchSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        actions.cluster.setClusterBy(clusterBy);
        console.log("cluster by", clusterBy, appContext.state.userState.clusterBy)
        await actions.cluster.clusterBy(
            appContext.state.userState.userId,
            appContext.state.userState.constellationName,
            appContext.state.userState.clusterBy,
            unclusteredContent !== 0) // if unclustered content then only cluster that
        actions.display.setUpdated(Date.now());
    }

    const onClusterClick = async () => {
        console.log("on cluster click")
        const suggestedCluster = await actions.cluster.getClusterBySuggestion(
            appContext.state.userState.userId,
            appContext.state.userState.constellationName,
        );
        setNewClusterBy(suggestedCluster);
    }

    // effects
    useEffect(() => {
        console.log("get constellation")
        const getConstellation = async () => {
            const constellation = await actions.constellation.getConstellation(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName);
            actions.constellation.setConstellation(constellation);
        };
        getConstellation();
    }, [actions.constellation,
        appContext.state.userState.userId,
        appContext.state.userState.constellationName,
        appContext.state.userState.updated]);

    useEffect(() => {
        console.log("get cluster")
        const getCluster = async () => {
            const clusters = await actions.cluster.getClusters(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                appContext.state.userState.clusterBy);
            actions.cluster.setClusters(clusters);
        };
        getCluster();
    }, [actions.cluster,
        appContext.state.userState.userId,
        appContext.state.userState.constellationName,
        appContext.state.userState.clusterBy,
        appContext.state.userState.updated]);

    useEffect(() => {
        console.log("get options")
        const getOptions = async () => {
            const options = await actions.cluster.getClusterByOptions(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName
            )
            setNewClusterByOptions(options)
        }
        getOptions();
    }, [actions.cluster,
        appContext.state.userState.userId,
        appContext.state.userState.constellationName]);
    
    useEffect(() => {
        console.log("set constellation display points")
        console.log(appContext.state.userState.constellation)
        constellationPts.current = setConstellationDisplayPoints(
            appContext.state.userState.constellation,
            appContext.state.userState.clusters,
            canvasRef,
            setUnclusteredContent);
        console.log(constellationPts.current)
        redrawConstellation();
    }, [appContext.state.userState.constellation, appContext.state.userState.clusters, redrawConstellation])

    useEffect(() => {
        console.log("set cluster display points")
        console.log(appContext.state.userState.clusters)
        clusterPts.current = setClusterDisplayPoints(appContext.state.userState.clusters, canvasRef);
        console.log(clusterPts.current)
        redrawConstellation();
    }, [appContext.state.userState.clusters, redrawConstellation])

    useEffect(() => {
        const space = new CanvasSpace(canvasRef.current || "").setup({ bgcolor: CnstlltnTheme.palette.black, resize: true });
        const form = space.getForm();
        const maxDimensions = { width: 2000, height: 1200 }
        const handleResize = () => {
            console.log("resizing to: ", canvasRef.current?.parentElement?.clientWidth, canvasRef.current?.parentElement?.clientHeight)
            if (canvasRef.current?.parentElement) {
                const newWidth = Math.min(canvasRef.current.parentElement.clientWidth, maxDimensions.width)
                const newHeight = Math.min(canvasRef.current.parentElement.clientHeight, maxDimensions.height)
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
                updatePositions();
            },
            animate: (time, ftime) => {
                drawConstellationPoints(space, form, constellationPts);
                drawClusterPoints(form, clusterPts);
                if (lastSelected) {
                    drawMultiLineText(form, canvasRef.current?.width || 0, lastSelected, 15, 400);
                }
                if (unclusteredContent !== 0) {
                    drawUnclusteredContentNotification(form, canvasRef.current?.width || 0, unclusteredContent);
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { // Check if the mouse click is released, which indicates a click
                    const mousePt = new Pt(x, y); // Create a Pt from the mouse position
                    const range = Circle.fromCenter(mousePt, r);
                    constellationPts.current.forEach(pt => {
                        if (Circle.withinBound(range, pt.position)) {
                            if (appContext.state.userState.constellationName === "Home") {
                                setLastSelected(null)
                                actions.constellation.setConstellationName(pt.name);
                            } else {
                                pt.selected = !pt.selected;
                                setLastSelected(pt.selected ? pt : null)
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
    }, [lastSelected,
        dimensions,
        constellationPts,
        clusterPts,
        appContext.state.userState.constellationName,
        constellationRedrawn]);

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
                            {"Cluster by:"}
                        </div>
                        <Stack>
                        <SearchBox
                            value={clusterBy}
                            placeholder={appContext.state.userState.clusterBy}
                            onChange={onTypeClusterByChange}
                            onSearch={onSearchSubmit}
                            styles={clusterByStyle}>
                            </SearchBox>
                            <Stack horizontal>
                            <button type="button" onClick={onClusterClick} style={{ flexShrink: 0 }}>
                                AI Suggested Clustering
                            </button>
                            <select onChange={onDropdownChange} style={{flexGrow: 1}}>
                                <option value="">Select Cluster</option>
                                {clusterByOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack.Item>
            </Stack>
            <Stack.Item grow={1} styles={canvasStackStyle}>
                <canvas ref={canvasRef} id="pt"/>
            </Stack.Item>
        </Stack>
    );
}

export default ConstellationPane