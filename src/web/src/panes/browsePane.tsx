// react imports
import { SearchBox, Stack, IconButton } from '@fluentui/react';
import { FC, ReactElement, useContext, useMemo, useState, ChangeEvent, useEffect, useCallback } from "react";
// state imports
import { AppContext } from '../state/applicationState';
import { QueryResponse } from '../state/queryState';
import UserAppContext from '../state/userContext';
import { bindActionCreators } from '../state/actions/actionCreators';
import { QueryActions } from '../state/actions/queryActions';
import * as queryActions from '../state/actions/queryActions';
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// components
import { LoadingDots } from '../components/loadingDots';
// ux imports
import { browsePaneStyle, browseStackStyle, browseButtonStackStyle, drillDownButtonStackStyle, drillDownButtonStyles } from "../ux/panes/browse";
import { stackItemPadding, saveSelectedButtonStyle, queryFieldStyles, badInputNotifications, buttonStyles, selectedButtonStyles } from '../ux/shared/components';

const BrowsePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        query: bindActionCreators(queryActions, appContext.dispatch) as unknown as QueryActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);

    // display
    const [newMaterial, setNewMaterial] = useState('');
    const [emptyMaterial, setEmptyMaterial] = useState(false);
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const [emptySelection, setEmptySelection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // functions
    const onTypeSource = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewMaterial(newValue || '');
    }

    const onSubmit = useCallback(async () => {      
        console.log("onSubmit", newMaterial)
        if (newMaterial) {
            console.log("new material", newMaterial)
            setIsLoading(true);
            const browseResponses = await actions.query.postBrowse({material: newMaterial});
            actions.query.setQueryResponseList(browseResponses.map(response => ({
                title: response.title,
                source: response.source,
                content: response.content
            })));
            appContext.state.queryState.responses?.forEach((response, index) => {
                console.log("response " + index + " " + response.title)
            });
            actions.query.pushBrowseState({
                material: newMaterial,
                responses: browseResponses
            });
            setIsLoading(false);
            setSelectedResponses(new Set());
            setNewMaterial('');
        } else {
            setEmptyMaterial(true);    
        }
    }, [newMaterial, actions.query, appContext.state.queryState.responses]);

    const onDrillDown = (index: number) => {
        if (isLoading) return;
        setIsLoading(true);
        console.log("Starting drill down", index, isLoading);
        const browseState = appContext.state.browseStateStack[appContext.state.browseStateStack.length - 1];
        console.log("browseState", browseState.responses[index].material);
        setNewMaterial(browseState.responses[index].material || '');
    }

    const toggleResponseSelection = (index: number) => {
        const newSelectedResponses = new Set(selectedResponses);
        if (newSelectedResponses.has(index)) {
            newSelectedResponses.delete(index);
        } else {
            newSelectedResponses.add(index);
        }
        setSelectedResponses(newSelectedResponses);
    };

    const saveSelectedResponses = async () => {
        if (selectedResponses.size > 0 ) {
            console.log("queryResponseList " + appContext.state.queryState.responses)
            const responsesToSave = Array.from(selectedResponses).map(index => appContext.state.queryState.responses?.[index])
                .filter((response): response is QueryResponse => response !== undefined);
            for (const response of responsesToSave) {
                console.log("response " + response)
            }
            const savedFrameworks = await actions.constellation.saveSelectedFrameworks(
                appContext.state.userState.userId,
                appContext.state.userState.constellationName,
                responsesToSave);
            for (const framework of savedFrameworks) {
                console.log("framework " + framework)
            }
            // set selected responses to empty
            setSelectedResponses(new Set());
            actions.display.setUpdated(Date.now());
        } else {
            setEmptySelection(true);
        }
    };

    // effects
    useEffect(() => {
        console.log("non-empty source")
        if (newMaterial) {
            setEmptyMaterial(false);
        }
    }, [newMaterial])
    
    useEffect(() => {
        console.log("non-empty selection")
        if (selectedResponses.size > 0) {
            setEmptySelection(false);
        }
    }, [selectedResponses])

    useEffect(() => {
        console.log("browse pane reset")
        setSelectedResponses(new Set());
        setNewMaterial('');
        actions.query.setQueryResponseList(undefined);
    }, [actions.query, appContext.state.userState.constellationName])

    useEffect(() => {
        const handleSubmit = async () => {
            if (isLoading && newMaterial) {
                console.log("onSubmit triggered")
                await onSubmit();
                console.log("onSubmit done")
                setIsLoading(false);
                console.log("setIsLoading done")
            }
        };
        console.log("drill down triggered submit")
        handleSubmit();
    }, [newMaterial, isLoading, onSubmit])

    return (
        <Stack styles={browsePaneStyle}>
            <Stack.Item tokens={stackItemPadding}>
                <SearchBox
                    value={newMaterial}
                    placeholder="Copy-paste source article or video transcript"
                    onChange={onTypeSource}
                    onSearch={onSubmit}
                    styles={queryFieldStyles}
                    iconProps={{styles: {root: { display: 'NewsSearch' }}}}
                />
            </Stack.Item>
            {(emptyMaterial || (appContext.state.queryState.responses?.length === 0 && emptySelection)) &&
                (
                    <Stack.Item styles={badInputNotifications}>
                        Hey, try copy-pasting in an article or video transcript first.
                    </Stack.Item>
                )
            }
            {
                appContext.state.queryState.responses?.length !== 0 && emptySelection && (
                    <Stack.Item styles={badInputNotifications}>
                        Click on the notes you want to save before trying to save to constellation.
                    </Stack.Item>
                )
            }
            <Stack.Item tokens={stackItemPadding}>
                {isLoading ? (
                    <LoadingDots />
                ) : (
                    appContext.state.queryState.responses && appContext.state.queryState.responses.map((response, index) => (
                        <Stack horizontal styles={browseStackStyle}>\
                            <Stack.Item styles={browseButtonStackStyle}>
                            <button 
                            key={index} 
                            className={selectedResponses.has(index) ? selectedButtonStyles: buttonStyles} 
                            onClick={() => toggleResponseSelection(index)}>
                                    {response.title}: {response.content}
                                </button>
                            </Stack.Item>
                            <Stack.Item styles={drillDownButtonStackStyle}>
                                <IconButton aria-label="DrillDown" iconProps={{ iconName: "ChevronRight" }} onClick={() => onDrillDown(index)} styles={drillDownButtonStyles} />
                            </Stack.Item>
                        </Stack>
                    ))
                )}
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                <button className={saveSelectedButtonStyle} onClick={saveSelectedResponses}>
                    {"Save selected notes to constellation"}
                </button>
            </Stack.Item>
        </Stack>
    )
}

export default BrowsePane;