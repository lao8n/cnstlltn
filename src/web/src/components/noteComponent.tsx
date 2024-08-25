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
    console.log("readOnly:", disabled);
    // functions
    const calculateTextHeight = (textLength: number) => {
        const charsPerLine = 30;
        const lineHeight = 20;
        const padding = 10;
        const heightText = Math.max(textLength / charsPerLine * lineHeight + padding, lineHeight + padding);
        console.log("text height:", textLength, heightText);
        return heightText;
    }
    const handleTextChange = (_: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setText(newValue || '');
    };
    const getDynamicStyles = (): Partial<ITextFieldStyles> => {
        return {
            ...noteTextFieldStyle,
            fieldGroup: {
                ...(noteTextFieldStyle?.fieldGroup as object || {}),
                height: `${calculateTextHeight(text.length)}px`,  
            }
        };
    };
    const handleTextSubmit = () => {
        console.log('text submitted');
    };
        
    return (
      <Stack styles={noteComponentStackStyle} tokens={{ childrenGap: 10 }}>
        <TextField 
            styles={getDynamicStyles()}
            multiline={true}
            resizable={false}
            value={text}
            disabled={disabled}
            onChange={handleTextChange}
            onBlur={handleTextSubmit}
          />
      </Stack>
    );
}

export default EditableNoteComponent;