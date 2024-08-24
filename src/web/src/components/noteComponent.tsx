// react imports
import { Stack, TextField, ITextFieldStyles } from "@fluentui/react";
import { useState, FormEvent } from "react";
// ux imports
import { noteComponentStackStyle, noteTextFieldStyle } from "../ux/components/note";

interface EditableNoteProps {
    welcomeScreen: boolean
    initialContent: string;
}

const EditableNoteComponent: React.FC<EditableNoteProps> = ({ welcomeScreen, initialContent }) => {
    const [text, setText] = useState(initialContent);

    // functions
    const calculateTextHeight = (textLength: number) => {
        const heightText = Math.max(textLength / 57 * 20 + 5, 20 + 5);
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
            readOnly={!welcomeScreen}
            onChange={handleTextChange}
            onSubmit={handleTextSubmit}
          />
      </Stack>
    );
}

export default EditableNoteComponent;