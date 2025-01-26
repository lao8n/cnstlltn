// react imports
import { SearchBox, Stack, IconButton, mergeStyles} from '@fluentui/react';
import { FC, ReactElement, useContext, useMemo, useState, ChangeEvent, useEffect } from "react";
// state imports
import { AppContext } from '../state/applicationState';
import { BrowseResponse } from '../state/browseState';
import UserAppContext from '../state/userContext';
import { bindActionCreators } from '../state/actions/actionCreators';
import { BrowseActions } from '../state/actions/browseActions';
import * as browseActions from '../state/actions/browseActions';
import { ConstellationActions } from '../state/actions/constellationActions';
import * as constellationActions from '../state/actions/constellationActions';
import { DisplayActions } from '../state/actions/displayActions';
import * as displayActions from '../state/actions/displayActions';
// components
import { LoadingDots } from '../components/loadingDots';
// ux imports
import { browsePaneStyle, browseStackStyle, browseButtonStackStyle, drillDownButtonStackStyle, drillDownButtonStyles, drillUpIconStyles, browseBarStyle, materialAttachedButtonStyle, browsePaneItemStyle, buttonTextStyles, selectedButtonTextStyles, drillUpButtonStackStyle, toggleSetSourceButtonStyle } from "../ux/panes/browse";
import { stackItemPadding, saveSelectedButtonStyle, textFieldStyles, badInputNotifications, buttonStyles, selectedButtonStyles } from '../ux/shared/components';
import { blackLoadingDots } from '../ux/components/loadingDots';

const BrowsePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        browse: bindActionCreators(browseActions, appContext.dispatch) as unknown as BrowseActions,
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions
    }), [appContext.dispatch]);

    // display
    const [newMaterial, setNewMaterial] = useState('');
    const [newManuallySetSource, setNewManuallySetSource] = useState('');
    const [previousTitles, setPreviousTitles] = useState(['Browse Home']);
    const [materialAttached, setMaterialAttached] = useState(true);
    const [emptyMaterial, setEmptyMaterial] = useState(false);
    const [selectedResponses, setSelectedResponses] = useState<Set<number>>(new Set());
    const [emptySelection, setEmptySelection] = useState(false);
    const [isSetSourceVisible, setIsSetSourceVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tryingToSaveOnHome, setTryingToSaveOnHome] = useState(false);

    // functions
    const onTypeSource = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewMaterial(newValue || '');
    }

    const onTypeSetSource = (_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
        setNewManuallySetSource(newValue || '');
    }

    const toggleSetSource = () => {
        setIsSetSourceVisible(!isSetSourceVisible);
    };

    const onSwitchMaterialAttached = () => {
        setMaterialAttached(!materialAttached);
        setNewMaterial('');
        setNewManuallySetSource('');
        setEmptyMaterial(false);
        setEmptySelection(false);
        setSelectedResponses(new Set());
        setPreviousTitles(['Browse Home']);
    }

    const onSubmitMaterial = async () => {      
        console.log("onSubmit", newMaterial)
        if (newMaterial) {
            console.log("new material", newMaterial)
            actions.browse.setBrowseMaterial(newMaterial);
            setIsLoading(true);
            setPreviousTitles(['Browse Home']);
            const browseResponses = await actions.browse.postBrowse({
                attachment: materialAttached,
                material: newMaterial, // can be slight delay in set browse material
                messages: []
            });
            actions.browse.setBrowseMessages([{ // reset as new material
                chosen: "",
                responses: browseResponses.map(response => ({
                    title: response.title,
                    source: newManuallySetSource === '' ? response.source : newManuallySetSource,
                    flag: response.flag,
                    content: response.content
                }))
            }]);
            appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses?.forEach((response: BrowseResponse, index: number) => {
                console.log("response " + index + " " + response.title)
            });
            setIsLoading(false);
            setSelectedResponses(new Set());
        } else {
            setEmptyMaterial(true);    
        }
    };

    const onDrillDown = async (index: number) => {
        console.log("drill down")
        // find selected response
        const currentState = appContext.state.browseState.messages.map(message => ({
            // deep copy
            ...message,
            responses: [...message.responses]
        }));
        const lastMessageIndex = currentState.length - 1;
        const lastMessage = currentState[lastMessageIndex];
        const selectedResponse = lastMessage.responses[index];
        console.log("selected response", selectedResponse);

        // set selected response
        actions.browse.setBrowseChosen(selectedResponse.title);
        console.log("browse chosen", selectedResponse.title)
        setPreviousTitles([...previousTitles, selectedResponse.title]);
        setIsLoading(true)
        currentState[lastMessageIndex].chosen = selectedResponse.title // we have local copy

        // browse call
        console.log("messages, should be none unchosen", currentState)
        const browseResponses = await actions.browse.postBrowse({
            attachment: materialAttached,
            material: appContext.state.browseState.material,
            messages: currentState
        });
        console.log("browse responses", browseResponses)

        // update messages 
        actions.browse.pushBrowseMessage({
            chosen: "", // user hasn't chosen yet
            responses: browseResponses.map(response => ({
                title: response.title,
                source: response.source,
                flag: response.flag,
                content: response.content
            }))
        });
        setSelectedResponses(new Set());
        setIsLoading(false);
    }

    const onDrillUp = () => {
        console.log("drill up");
        const newPreviousTitles = previousTitles.slice(0, -1);
        setPreviousTitles(newPreviousTitles);
        actions.browse.popBrowseMessage();
        actions.browse.setBrowseChosen("");
        const poppedMessages = appContext.state.browseState.messages;
        console.log("messages", poppedMessages)
        setSelectedResponses(new Set());
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
        if (appContext.state.userState.constellationName === "Home") {
            setTryingToSaveOnHome(true);
        } else if (selectedResponses.size > 0 ) {
            console.log("browse responses " + appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses)
            const responsesToSave = Array.from(selectedResponses).map(index => appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses[index])
                .filter((response): response is BrowseResponse => response !== undefined);
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
        console.log("set trying to save on home to false")
        if (tryingToSaveOnHome && appContext.state.userState.constellationName !== "Home") {
            setTryingToSaveOnHome(false);
        }
    }, [appContext.state.userState.constellationName, tryingToSaveOnHome])

    useEffect(() => {
        console.log("browse pane reset")
        setSelectedResponses(new Set());
        setNewMaterial('');
        actions.browse.setBrowseMaterial('');
        actions.browse.setBrowseChosen('');
        actions.browse.setBrowseMessages([]);
    }, [actions.browse])

    useEffect(() => {
        console.log("Messages length:", appContext.state.browseState.messages.length);
        if (appContext.state.browseState.messages.length > 0) {
            console.log("Last message responses:", appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses);
        }
    }, [appContext.state.browseState.messages]);

    return (
        <Stack styles={browsePaneStyle}>
            <Stack.Item tokens={stackItemPadding}>
                <Stack horizontal styles={browseBarStyle}>
                    <Stack.Item align="stretch">
                        <IconButton aria-label="material attached"
                            iconProps={{ iconName: materialAttached ? "Copy" : "BookAnswers" }}
                            onClick={onSwitchMaterialAttached}
                            styles={materialAttachedButtonStyle} />
                    </Stack.Item>
                    <Stack.Item align="stretch">
                        <IconButton aria-label="Toggle set source"
                            iconProps={{ iconName: isSetSourceVisible ? "ChevronDown" : "ChevronRight" }}
                            onClick={toggleSetSource} styles={toggleSetSourceButtonStyle} />
                    </Stack.Item>
                    <Stack.Item styles={browseBarStyle}>
                        <SearchBox
                            value={newMaterial}
                            placeholder={materialAttached ? "Copy-paste source article or video transcript" : "Name and author of book"}
                            onChange={onTypeSource}
                            onSearch={onSubmitMaterial}
                            styles={textFieldStyles}
                            iconProps={{ iconName: "None" }}
                            />
                    </Stack.Item>
                </Stack>
                {isSetSourceVisible && (
                    <Stack.Item>
                        <SearchBox
                            value={newManuallySetSource}
                            placeholder="(Optional) Manually set source material"
                            onChange={onTypeSetSource}
                            onSearch={onSubmitMaterial}
                            styles={textFieldStyles}
                            iconProps={{ iconName: "None" }}
                        />
                    </Stack.Item>
                )}
            </Stack.Item>
            {(emptyMaterial || (appContext.state.browseState.messages.length > 0 &&
                appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses?.length === 0 && emptySelection)) &&
                (
                    <Stack.Item styles={badInputNotifications}>
                        Hey, try copy-pasting in an article or video transcript first.
                    </Stack.Item>
                )
            }
            {
                (appContext.state.browseState.messages.length > 0 &&
                    appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses?.length !== 0 && emptySelection) && (
                    <Stack.Item styles={badInputNotifications}>
                        Click on the notes you want to save before trying to save to constellation.
                    </Stack.Item>
                )
            }
            {tryingToSaveOnHome && (
                <Stack.Item styles={badInputNotifications}>
                    If you want to save notes to your constellation, you need to click into a constellation first.
                </Stack.Item>
            )}
            <Stack styles={browsePaneItemStyle}>
                {isLoading ? (
                    <LoadingDots style={blackLoadingDots} />
                ) : (
                    <Stack styles={browsePaneStyle}>
                        {appContext.state.browseState.messages.length > 1 && previousTitles.length > 1 && (
                            <Stack.Item 
                                onClick={onDrillUp} 
                                styles={drillUpButtonStackStyle}
                            >
                                <IconButton
                                    iconProps={{ iconName: "ChevronLeft" }}
                                    styles={{
                                        root: drillUpIconStyles,
                                        icon: { fontSize: '12px', marginRight: '8px' }
                                    }}
                                />
                                <span className={buttonTextStyles}>
                                    {previousTitles[previousTitles.length - 2]}
                                </span>
                            </Stack.Item>
                        )}
                        {appContext.state.browseState.messages.length > 0 &&
                            appContext.state.browseState.messages[appContext.state.browseState.messages.length - 1].responses?.map((response, index) => (
                                <Stack horizontal styles={browseStackStyle} key={index}>
                                    {response.flag === true ? (
                                        <Stack horizontal styles={browseStackStyle}>
                                            <Stack.Item styles={browseButtonStackStyle} grow>
                                                <button 
                                                    className={selectedResponses.has(index) ? selectedButtonStyles : buttonStyles} 
                                                    onClick={() => toggleResponseSelection(index)}>
                                                    <span className={selectedResponses.has(index) ? selectedButtonTextStyles : buttonTextStyles}>
                                                    <strong>{response.title}</strong>: {response.content}
                                                    </span>
                                                </button>
                                            </Stack.Item>
                                            <Stack.Item styles={drillDownButtonStackStyle}>
                                                <IconButton 
                                                    aria-label="DrillDown" 
                                                    iconProps={{ iconName: "ChevronRight" }} 
                                                    onClick={() => onDrillDown(index)} 
                                                    styles={drillDownButtonStyles} 
                                                />
                                            </Stack.Item>
                                        </Stack>
                                    ) : (
                                        <Stack horizontal styles={browseStackStyle}>
                                            <Stack.Item styles={browseButtonStackStyle} grow>
                                                <button 
                                                    className={mergeStyles(
                                                        selectedResponses.has(index) ? selectedButtonStyles : buttonStyles,
                                                        { marginRight: '32px' }
                                                    )}
                                                    onClick={() => toggleResponseSelection(index)}>
                                                    <span className={selectedResponses.has(index) ? selectedButtonTextStyles : buttonTextStyles}>
                                                        <strong>{response.title}</strong>: {response.content}
                                                    </span>
                                                </button>
                                            </Stack.Item>
                                        </Stack>
                                    )}
                                </Stack>
                            ))
                        }
                    </Stack>
                )}
            </Stack>
            <Stack.Item tokens={stackItemPadding}>
                <button className={saveSelectedButtonStyle} onClick={saveSelectedResponses}>
                    {"Save selected notes to constellation"}
                </button>
            </Stack.Item>
        </Stack>
    )
}

export default BrowsePane;