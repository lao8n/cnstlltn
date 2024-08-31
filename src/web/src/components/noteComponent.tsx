// react imports
import { Stack, TextField } from "@fluentui/react";
import { useState, FormEvent, useContext, useMemo } from "react";
// state imports
import { AppContext } from "../state/applicationState"
import UserAppContext from "../state/userContext"
import { bindActionCreators } from "../state/actions/actionCreators";
import { NoteActions } from "../state/actions/noteActions";
import * as noteActions from "../state/actions/noteActions";
// ux imports
import { noteComponentStackStyle, noteTextFieldStyle } from "../ux/components/note";

interface EditableNoteProps {
    disabled: boolean
    field: string
    initialContent: string;
}

const EditableNoteComponent: React.FC<EditableNoteProps> = ({ disabled, field, initialContent }) => {
    const appContext = useContext<AppContext>(UserAppContext)
    const actions = useMemo(() => ({
        note: bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActions,
    }), [appContext.dispatch]);
    const [text, setText] = useState(initialContent);

    // Remove calculateTextHeight and getDynamicStyles functions

    const handleTextChange = (_: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setText(newValue || '');
    };

    const handleTextSubmit = async () => {
        if (appContext.state.userState.selectedContent) {
            const selectedContent = appContext.state.userState.selectedContent;
            let newContent;
            if (field === "tags") {
                newContent = { ...selectedContent, [field]: text.split(", ") };
            } else {
                newContent = { ...selectedContent, [field]: text };
            }
            console.log("save new note ", newContent);
            actions.note.setSelectedContent(newContent);
            await actions.note.editFramework(appContext.state.userState.userId, newContent);
        }
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleTextSubmit();
        }
    }

    return (
      <Stack styles={noteComponentStackStyle}>
        <TextField 
            styles={noteTextFieldStyle}
            multiline={true}
            autoAdjustHeight
            resizable={false}
            value={text}
            placeholder={field === "title" ? "Enter title" : field === "content" ? "Enter your note here" : field === "source" ? "Add source" : field === "tags" ? "Add comma separated tags" : ""}
            disabled={disabled}
            onChange={handleTextChange}
            onBlur={handleTextSubmit}
            onKeyDown={handleEnter}
          />
      </Stack>
    );
}

export default EditableNoteComponent;