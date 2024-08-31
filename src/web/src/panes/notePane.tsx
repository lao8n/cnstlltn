// react imports
import { Stack, IconButton, Image } from "@fluentui/react"
import { FC, ReactElement, useContext, useMemo } from "react"
// state imports
import { AppContext } from "../state/applicationState"
import { bindActionCreators } from "../state/actions/actionCreators";
import UserAppContext from "../state/userContext"
import { NoteActions } from "../state/actions/noteActions"
import * as noteActions from "../state/actions/noteActions"
import { DisplayActions } from "../state/actions/displayActions"
import * as displayActions from "../state/actions/displayActions"
// components
import EditableNoteComponent from "../components/noteComponent"
// ux imports
import { noteStackStyle, noteNameStyle, noteSubStackStyle, noteSubStackItemStyle, deleteButtonStyle } from "../ux/panes/note"
import { stackItemPadding } from "../ux/shared/components";

const NotePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        note: bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActions,
        display: bindActionCreators(displayActions, appContext.dispatch) as unknown as DisplayActions,
    }), [appContext.dispatch]);
    const disabled = appContext.state.userState.userId === "" || appContext.state.userState.userId === "welcome_user"
    
    // functions
    const handleDelete = async () => {
        if (appContext.state.userState.selectedContent) {
            await actions.note.deleteFramework(appContext.state.userState.userId, appContext.state.userState.selectedContent);
            actions.note.setSelectedContent(null);
            actions.display.setUpdated(Date.now());
        }
    }

    return (
        <Stack styles={noteStackStyle}>
            <Stack.Item className={noteNameStyle} tokens={stackItemPadding}>
                NOTES 
            </Stack.Item>
            {
                appContext.state.userState.selectedContent && (
                    <Stack styles={noteSubStackStyle}>
                        <Stack horizontal styles={noteSubStackStyle} tokens={stackItemPadding}>
                            <Stack.Item styles={noteSubStackItemStyle}>
                                <EditableNoteComponent disabled={disabled} field="title" initialContent={appContext.state.userState.selectedContent?.title} />
                            </Stack.Item>
                            {(appContext.state.userState.userId !== "" && appContext.state.userState.userId !== "welcome_user") && (
                            <Stack.Item>
                                <IconButton iconProps={{ iconName: "Delete" }} onClick={handleDelete} styles={deleteButtonStyle} />
                                </Stack.Item>
                            )}
                        </Stack>
                        {
                            appContext.state.userState.userId !== "welcome_user" && appContext.state.userState.userId !== "" && (
                        <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                            <EditableNoteComponent disabled={disabled} field="source" initialContent={appContext.state.userState.selectedContent?.source ?? ""} />
                            </Stack.Item>
                        )}
                        <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                            <EditableNoteComponent disabled={disabled} field="content" initialContent={appContext.state.userState.selectedContent?.content} />
                        </Stack.Item>
                        {
                            appContext.state.userState.userId !== "welcome_user" && appContext.state.userState.userId !== "" && (
                                <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                                    <EditableNoteComponent 
                                        disabled={disabled} 
                                        field="tags" 
                                        initialContent={Array.isArray(appContext.state.userState.selectedContent?.tags) 
                                            ? appContext.state.userState.selectedContent.tags.join(", ") 
                                            : ""}
                                    />
                                </Stack.Item>
                            )
                        }
                        {
                            (appContext.state.userState.userId === "welcome_user" || appContext.state.userState.userId === "") && appContext.state.userState.selectedContent?.title === "Browsing YouTube transcript" && (
                                <Stack>
                                <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                                        <Image src={`${process.env.PUBLIC_URL}/transcript.png`} width="100%" />
                                        <span>Copy-paste the transcript</span>
                                </Stack.Item>
                                <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                                        <Image src={`${process.env.PUBLIC_URL}/browse.png`} width="100%" />
                                        <span>Browse the transcript - notice the arrows to the right of some notes</span>
                                    </Stack.Item>
                                    <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                                        <Image src={`${process.env.PUBLIC_URL}/drilldown.png`} width="100%" />
                                        <span>Drilling-down we can get more details</span>
                                    </Stack.Item>   
                                </Stack>
                            )
                        }
                    </Stack>
                )
            }
            {
                !appContext.state.userState.selectedContent && (
                    <Stack styles={noteSubStackStyle}>
                        <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                            <EditableNoteComponent disabled={true} field="" initialContent={'Select a note to view'} />
                        </Stack.Item>
                    </Stack>
                )
            }
        </Stack>
    )
}

export default NotePane;