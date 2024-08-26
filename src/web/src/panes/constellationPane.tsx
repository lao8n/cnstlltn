// react imports
import { SearchBox, Stack } from '@fluentui/react';
import React, { FC, ReactElement, useContext, useEffect, useState, useMemo, useRef, useCallback, ChangeEvent } from "react";
// state imports
import { AppContext } from "../state/applicationState";
import { QueryResponse } from '../state/queryState';
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
// ux imports
import { CnstlltnTheme } from "../ux/shared/theme";
import { canvasStackStyle, canvasStyle } from '../ux/shared/components';
import { constellationHeaderStackStyle, constellationStackStyle, stackItemPadding, constellationNameStyle, clusterByStyle, canvasHeaderButtonStyle, clusteringSuggestionButtonStyle, buttonStackStyle, selectClusteringStyle, createConstellationButtonStyle } from '../ux/panes/constellation';
// display imports
import { CanvasSpace, Circle, Pt } from "pts";
import { DisplayPoint, TwinklePoint } from '../frontend/models';
import { setConstellationDisplayPoints, setClusterDisplayPoints, drawConstellationPoints, drawClusterPoints, drawUnclusteredContentNotification, drawNoConstellationContentNotification, updatePositions } from '../frontend/display';

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
        note: bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions,
    }), [appContext.dispatch]);

    // display
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const constellationPts = useRef<DisplayPoint[]>([]) as React.MutableRefObject<DisplayPoint[]>;
    const clusterPts = useRef<DisplayPoint[]>([]) as React.MutableRefObject<DisplayPoint[]>;
    const twinklePoints = useRef<TwinklePoint[]>([]) as React.MutableRefObject<TwinklePoint[]>;
    const [constellationRedrawn, setConstellationRedrawn] = useState(Date.now());
    const [unclusteredContent, setUnclusteredContent] = useState(0);
    const [createdConstellationName, setCreatedConstellationName] = useState('');
    const [clusterBy, setNewClusterBy] = useState(appContext.state.userState.clusterBy);
    const [clusterByOptions, setNewClusterByOptions] = useState<string[]>([]);
    const [buttons, setButtons] = useState<string[]>(["CLUSTER BY"]);
    const [selectedButton, setSelectedButton] = useState(buttons[0]);

    // functions
    const redrawConstellation = useCallback(() => {
        setConstellationRedrawn(Date.now());
    }, []);

    const updatePositionsCallback = useCallback(() => {
        updatePositions(canvasRef, constellationPts, clusterPts, twinklePoints);
    }, []);
    
    const onTypeConstellationName = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setCreatedConstellationName(newValue || '');
    }

    const onTypeClusterBy = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewClusterBy(newValue || '');
    }

    const onDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
        console.log("drop down change: ", event.target.value);
        setNewClusterBy(event.target.value);
    };

    const onCreateConstellationSubmit = async () => {
        if (createdConstellationName) {
            const responses: QueryResponse[] = [{ title: createdConstellationName, source: "", content: "" }];
            const createdConstellation = await actions.constellation.saveSelectedFrameworks(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                responses,
            )
            console.log(createdConstellation)
            actions.display.setUpdated(Date.now());
        } 
    }

    const onClusterBySubmit = async () => {
        console.log("cluster by", clusterBy, appContext.state.userState.clusterBy)
        await actions.cluster.clusterBy(
            appContext.state.userState.userId,
            appContext.state.userState.constellationName,
            clusterBy,
            unclusteredContent !== 0) // if unclustered content then only cluster that
        console.log("cluster by await finished")
        actions.cluster.setClusterBy(clusterBy);
        actions.display.setUpdated(Date.now());
        console.log("cluster by set updated")
    }

    const onClusterClick = async () => {
        console.log("on cluster click")
        const suggestedCluster = await actions.cluster.getClusterBySuggestion(
            appContext.state.userState.userId,
            appContext.state.userState.constellationName,
        );
        setNewClusterBy(suggestedCluster);
    }

    const onButtonClick = (tabName: string) => {
        console.log("on button click", tabName)
        setSelectedButton(tabName);
    }

    // effects
    useEffect(() => {
        console.log("get constellation & cluster & update display points")
        const updateConstellationAndClusters = async () => {
            const constellation = await actions.constellation.getConstellation(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName);
            const clusters = await actions.cluster.getClusters(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                appContext.state.userState.clusterBy,
                appContext.state.userState.clusterBy === '');
            actions.constellation.setConstellation(constellation);
            actions.cluster.setClusters(clusters);
            // this is the case that we have gotten the latest clustering
            if (appContext.state.userState.clusterBy === '' && clusters.length > 0) { 
                console.log("latest cluster by:", clusters[0].clusterBy, clusters)
                setNewClusterBy(clusters[0].clusterBy)
            }
            let count = 0;
            clusterPts.current = setClusterDisplayPoints(clusters, canvasRef);
            [constellationPts.current, count] = setConstellationDisplayPoints(
                constellation,
                clusters,
                canvasRef);
            setUnclusteredContent(count);
            updatePositionsCallback();
            redrawConstellation();
        };
        updateConstellationAndClusters();
    }, [actions.constellation,
        actions.cluster,
        appContext.state.userState.userId,
        appContext.state.userState.constellationName,
        appContext.state.userState.clusterBy,
        appContext.state.userState.updated,
        redrawConstellation,
        updatePositionsCallback]);
    
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
        appContext.state.userState.constellationName,
        appContext.state.userState.updated]);

    useEffect(() => {
        if (appContext.state.userState.constellationName === "Home") {
            setButtons(["CREATE CONSTELLATION", "CLUSTER BY"]);
        } else {
            setButtons(["CLUSTER BY"]);
        }
    }, [appContext.state.userState.constellationName])

    useEffect(() => {
        setSelectedButton(buttons[0]);
    }, [buttons])

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
                if (unclusteredContent !== 0) {
                    drawUnclusteredContentNotification(form,  canvasRef.current?.parentElement?.clientWidth || 0, unclusteredContent);
                } 
                if (unclusteredContent === 0 && constellationPts.current.length === 0){
                    drawNoConstellationContentNotification(form,  canvasRef.current?.parentElement?.clientWidth || 0,  canvasRef.current?.parentElement?.clientHeight || 0, appContext.state.userState.constellationName, 15);
                }
            },
            action: (type, x, y) => {
                const r = 10;
                if (type === "up") { // Check if the mouse click is released, which indicates a click
                    const mousePt = new Pt(x, y);
                    const range = Circle.fromCenter(mousePt, r);
                    constellationPts.current.forEach(pt => {
                        if (Circle.withinBound(range, pt.position)) {
                            if (appContext.state.userState.constellationName === "Home") {
                                actions.constellation.setConstellation([]);
                                actions.cluster.setClusters([]);
                                actions.note.setSelectedContent(null);
                                setUnclusteredContent(0);
                                actions.cluster.setClusterBy('');
                                actions.constellation.setConstellationName(pt.name);
                                actions.display.setUpdated(Date.now());
                            } else {
                                pt.selected = !pt.selected;
                                actions.note.setSelectedContent(pt.selected ? pt.userFramework : null);
                            }
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
    }, [actions.constellation,
        actions.cluster,
        actions.note,
        actions.display,
        appContext.state.userState.constellationName,
        appContext.state.userState.selectedContent,
        unclusteredContent,
        constellationRedrawn,
        updatePositionsCallback]);

    return (
        <Stack styles={constellationStackStyle}>
            <Stack styles={constellationHeaderStackStyle}>
                <Stack horizontal>
                    {buttons.map((label, _) => (
                        <Stack.Item styles={buttonStackStyle(selectedButton === label)}>
                            <button type="button" onClick={() => onButtonClick(label)} className={canvasHeaderButtonStyle}>
                                {label}
                        </button>
                        </Stack.Item>
                    ))}
                </Stack>
                <Stack horizontal style={{width: '100%', paddingLeft: '10px', paddingRight: '10px'}}>
                    {
                        selectedButton === "CREATE CONSTELLATION" && (
                            <SearchBox
                                value={createdConstellationName}
                                placeholder={"Enter name of new constellation"}
                                onChange={onTypeConstellationName}
                                onSearch={onCreateConstellationSubmit}
                                styles={createConstellationButtonStyle}
                            />
                        )
                    }
                    {
                        selectedButton === "CLUSTER BY" && (
                        <Stack style={{width: '100%'}}>
                            <SearchBox
                                value={clusterBy}
                                placeholder={"Enter what you want to cluster by"}
                                onChange={onTypeClusterBy}
                                onSearch={onClusterBySubmit}
                                styles={clusterByStyle}
                            />
                                <Stack horizontal style={{width: '100%'}}>
                                <button type="button" onClick={onClusterClick} className={clusteringSuggestionButtonStyle}>
                                    CLUSTERING SUGGESTION
                                </button>
                                <select onChange={onDropdownChange} className={selectClusteringStyle}>
                                    <option value="">SELECT CLUSTERING</option>
                                    {clusterByOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                </Stack>
                            </Stack>
                        )
                    }
                        {
                        selectedButton === "FILTER BY" && (
                            <SearchBox
                                // value={clusterBy}
                                // onChange={onTypeClusterBy}
                                // onSearch={onSubmit}
                                styles={clusterByStyle}
                            />
                        )
                    }
                </Stack>
            </Stack>
            <Stack.Item styles={canvasStackStyle}>
                <canvas ref={canvasRef} style={canvasStyle} id="pt"/>
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                <div className={constellationNameStyle}>
                    {appContext.state.userState.constellationName}
                </div>
            </Stack.Item>
        </Stack>
    );
}

export default ConstellationPane