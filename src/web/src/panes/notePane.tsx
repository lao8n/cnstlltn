// react imports
import { Stack } from "@fluentui/react"
import { FC, ReactElement, useContext } from "react"
// state imports
import { AppContext } from "../state/applicationState"
import UserAppContext from "../state/userContext"
// ux imports
import { noteStackStyle } from "../ux/panes/note"
import { stackItemPadding } from "../ux/shared/components";

const NotePane: FC = (): ReactElement => {
    const appContext = useContext<AppContext>(UserAppContext)

    return (
        <Stack styles={noteStackStyle}>
            <Stack.Item tokens={stackItemPadding}>
                {appContext.state.userState.selectedContent?.name}
            </Stack.Item>
            <Stack.Item tokens={stackItemPadding}>
                {appContext.state.userState.selectedContent?.description}
            </Stack.Item>
        </Stack>
    )
}

export default NotePane;