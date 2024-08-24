// react imports
import { Stack, TextField } from "@fluentui/react";
import { useState, FormEvent } from "react";
// ux imports
import { noteComponentStackStyle, noteTextFieldStyle } from "../ux/components/note";

interface EditableNoteProps {
    welcomeScreen: boolean
    initialContent: string;
}

const EditableNoteComponent: React.FC<EditableNoteProps> = ({ welcomeScreen, initialContent }) => {
    const [text, setText] = useState(initialContent);
  
    const handleTextChange = (_: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setText(newValue || '');
    };
    const handleTextSubmit = () => {
        console.log('text submitted');
    };
        
    return (
      <Stack styles={noteComponentStackStyle} tokens={{ childrenGap: 10 }}>
        <TextField 
            styles={noteTextFieldStyle}
            multiline={true}
            resizable={true}
            value={text}
            readOnly={!welcomeScreen}
            onChange={handleTextChange}
            onSubmit={handleTextSubmit}
          />
      </Stack>
    );
}

export default EditableNoteComponent;

