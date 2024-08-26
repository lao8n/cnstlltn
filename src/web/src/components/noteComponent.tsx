// react imports
import { Stack, TextField, ITextFieldStyles } from "@fluentui/react";
import { useState, FormEvent, useContext, useMemo } from "react";
// state imports
import { AppContext } from "../state/applicationState"
import UserAppContext from "../state/userContext"
import { bindActionCreators } from "../state/actions/actionCreators";
import { ConstellationActions } from "../state/actions/constellationActions";
import * as constellationActions from "../state/actions/constellationActions";
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
        constellation: bindActionCreators(constellationActions, appContext.dispatch) as unknown as ConstellationActions,
        note: bindActionCreators(noteActions, appContext.dispatch) as unknown as NoteActions,
    }), [appContext.dispatch]);
    const [text, setText] = useState(initialContent);

    // functions
    const calculateTextHeight = (textLength: number) => {
        const charsPerLine = 30;
        const lineHeight = 20;
        const padding = 10;
        const heightText = Math.max(textLength / charsPerLine * lineHeight + padding, lineHeight + padding);
        return heightText;
    }
    const getDynamicStyles = (): Partial<ITextFieldStyles> => {
        return {
            ...noteTextFieldStyle,
            fieldGroup: {
                ...(noteTextFieldStyle?.fieldGroup as object || {}),
                height: `${calculateTextHeight(text.length)}px`,  
            }
        };
    };
    const handleTextChange = (_: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setText(newValue || '');
    };
    const handleTextSubmit = async () => {
        if (appContext.state.userState.selectedContent) {
            const selectedContent = appContext.state.userState.selectedContent;
            const newContent = { ...selectedContent, [field]: text };
            console.log("save new note ", newContent);
            actions.note.setSelectedContent(newContent);
            await actions.constellation.editFramework(appContext.state.userState.userId, newContent);
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
            styles={getDynamicStyles()}
            multiline={true}
            resizable={false}
            value={text}
            disabled={disabled}
            onChange={handleTextChange}
            onBlur={handleTextSubmit}
            onKeyDown={handleEnter}
          />
      </Stack>
    );
}

export default EditableNoteComponent;