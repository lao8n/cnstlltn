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
    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState(initialContent);
  
    const toggleEdit = () => {
      setEditMode(!editMode);
    };
  
    const handleTextChange = (_: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setText(newValue || '');
    };
    const handleTextSubmit = () => {
        setEditMode(false);
    };
        
    return (
      <Stack styles={noteComponentStackStyle} tokens={{ childrenGap: 10 }}>
        {!welcomeScreen && editMode ? (
                <TextField 
                    styles={noteTextFieldStyle}
                    multiline={true}
                    resizable={false}
                    value={text}
                    onChange={handleTextChange}
                    onSubmit={handleTextSubmit}
          />
            ) : (
                <TextField 
                    styles={noteTextFieldStyle}
                    width='100%'
                    multiline={true}
                    resizable={false}
                    value={text}
                    onClick={toggleEdit}
            />
        )}
      </Stack>
    );
}

export default EditableNoteComponent;

