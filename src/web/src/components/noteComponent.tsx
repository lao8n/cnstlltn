// react imports
import { Stack, TextField, IconButton } from "@fluentui/react";
import { useState, FormEvent } from "react";
// ux imports
import { noteLogoStyle } from "../ux/panes/note";
import { noteComponentStackStyle } from "../ux/components/note";

interface EditableNoteProps {
    initialContent: string;
}

const EditableNoteComponent: React.FC<EditableNoteProps> = ({ initialContent }) => {
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
        {editMode ? (
            <TextField 
                multiline={true}
                resizable={false}
                value={text}
                onChange={handleTextChange}
                onSubmit={handleTextSubmit}
          />
        ) : (
          <span>{text}</span>
            )}
        <IconButton iconProps={{ iconName: editMode ? "Save" : "Edit" }} onClick={toggleEdit} styles={noteLogoStyle} />
      </Stack>
    );
}

export default EditableNoteComponent;

