// react imports
import { SearchBox, Stack, IconButton } from '@fluentui/react';
import { FC, ReactElement, useContext, useMemo, useState, ChangeEvent, useEffect } from "react";
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
// ux imports
import { browsePaneStyle, browseStackStyle, browseButtonStackStyle } from "../ux/panes/browse";
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
    const onTypeSource = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewMaterial(newValue || '');
    }

    // functions
    const onSubmit = async () => {
        if (newMaterial) {
            console.log("new material", newMaterial)
            const browseResponses = await actions.query.postBrowse(newMaterial);
            actions.query.setQueryResponseList(browseResponses.map(response => ({
                title: response.title,
                source: response.source,
                content: response.content
            })));
            actions.query.pushBrowseState({
                material: newMaterial,
                responses: browseResponses
            });
            setSelectedResponses(new Set());
        } else {
            setEmptyMaterial(true);    
        }
    }
    const drillDown = (index: number) => {
        console.log("drill down", index)
        const browseState = appContext.state.browseStateStack[appContext.state.browseStateStack.length - 1];
        setNewMaterial(browseState.responses[index].source || '');
        onSubmit();
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

    // effects
    useEffect(() => {
        console.log("query pane reset")
        setSelectedResponses(new Set());
        setNewMaterial('');
        actions.query.setQueryResponseList(undefined);
    }, [actions.query, appContext.state.userState.constellationName])

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
                {appContext.state.queryState.responses && appContext.state.queryState.responses.map((response, index) => (
                    <Stack horizontal styles={browseStackStyle}>\
                        <Stack.Item styles={browseButtonStackStyle}>
                        <button 
                        key={index} 
                        className={selectedResponses.has(index) ? selectedButtonStyles: buttonStyles} 
                        onClick={() => toggleResponseSelection(index)}>
                                {response.title}: {response.content}
                            </button>
                        </Stack.Item>
                        <Stack.Item>
                            <IconButton aria-label="DrillDown" iconProps={{ iconName: "ChevronRight" }} onClick={() => drillDown(index)} />
                        </Stack.Item>
                    </Stack>
                ))}
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