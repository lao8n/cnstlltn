// react imports
import { Stack, TextField } from "@fluentui/react";
import { useState, FormEvent } from "react";
// ux imports
import { noteComponentStackStyle } from "../ux/components/note";

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
      <Stack horizontal styles={noteComponentStackStyle} tokens={{ childrenGap: 10 }}>
        {!welcomeScreen && editMode ? (
            <TextField 
                width='100%'
                multiline={true}
                resizable={false}
                value={text}
                onChange={handleTextChange}
                onSubmit={handleTextSubmit}
          />
            ) : (
            <TextField 
                width='100%'
                multiline={true}
                resizable={false}
                value={text}
                onChange={handleTextChange}
                onSubmit={handleTextSubmit}
                onClick={toggleEdit}
            />
            )}
        {/* <IconButton iconProps={{ iconName: editMode ? "Save" : "Edit" }} onClick={toggleEdit} styles={noteLogoStyle} /> */}
      </Stack>
    );
}

export default EditableNoteComponent;

