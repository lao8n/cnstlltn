// react imports
import { Stack, TextField, ITextFieldStyles } from "@fluentui/react";
import { useState, FormEvent } from "react";
// ux imports
import { noteComponentStackStyle, noteTextFieldStyle } from "../ux/components/note";

interface EditableNoteProps {
    readOnly: boolean
    initialContent: string;
}

const EditableNoteComponent: React.FC<EditableNoteProps> = ({ readOnly, initialContent }) => {
    const [text, setText] = useState(initialContent);
    console.log("readOnly:", readOnly);
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
            readOnly={readOnly}
            onChange={handleTextChange}
            onSubmit={handleTextSubmit}
          />
      </Stack>
    );
}

export default EditableNoteComponent;