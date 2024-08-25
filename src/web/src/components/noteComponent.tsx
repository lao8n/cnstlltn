// react imports
import { Stack, TextField, ITextFieldStyles } from "@fluentui/react";
import { useState, FormEvent } from "react";
// ux imports
import { noteComponentStackStyle, noteTextFieldStyle } from "../ux/components/note";

interface EditableNoteProps {
    disabled: boolean
    initialContent: string;
}

const EditableNoteComponent: React.FC<EditableNoteProps> = ({ disabled, initialContent }) => {
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
    const handleTextSubmit = () => {
        console.log('text submitted');
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