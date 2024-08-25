// react imports
import { Stack } from "@fluentui/react"
import { FC, ReactElement, useContext } from "react"
// state imports
import { AppContext } from "../state/applicationState"
import UserAppContext from "../state/userContext"
// components
import EditableNoteComponent from "../components/noteComponent"
// ux imports
import { noteStackStyle, noteNameStyle, noteSubStackStyle, noteSubStackItemStyle } from "../ux/panes/note"
import { stackItemPadding } from "../ux/shared/components";

const NotePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)
    const disabled = appContext.state.userState.userId === "" || appContext.state.userState.userId === "welcome_user"
    return (
        <Stack styles={noteStackStyle}>
            <Stack.Item className={noteNameStyle} tokens={stackItemPadding}>
                NOTES 
            </Stack.Item>
            {
                appContext.state.userState.selectedContent && (
                    <Stack styles={noteSubStackStyle}>
                        <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                            <EditableNoteComponent disabled={disabled} initialContent={appContext.state.userState.selectedContent?.title} />
                        </Stack.Item>
                        <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                            <EditableNoteComponent disabled={disabled} initialContent={appContext.state.userState.selectedContent?.content} />
                        </Stack.Item>
                    </Stack>
                )
            }
            {
                !appContext.state.userState.selectedContent && (
                    <Stack styles={noteSubStackStyle}>
                        <Stack.Item tokens={stackItemPadding} styles={noteSubStackItemStyle}>
                            <EditableNoteComponent disabled={true} initialContent={'No content selected'} />
                        </Stack.Item>
                    </Stack>
                )
            }
        </Stack>
    )
}

export default NotePane;