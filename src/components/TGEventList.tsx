import { useState } from 'react';
import { useTGEventContext } from '../context/TGEventContext';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { TGEvent, createNewTGEvent } from '../types/types';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useTGEventListContext } from '../context/TGEventListContext';

export const TGEventList = () => {
  const { tgEvent, setTGEvent } = useTGEventContext();
  const {tgEventList, setTGEventList} = useTGEventListContext();
  const [newTGEventName, setNewTGEventName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const craeteNewTGEvent = () => {
    if (newTGEventName.trim()) {
      addTGEvent(createNewTGEvent(newTGEventName, []))
    }
  };

  const addTGEvent = (newTGEvent: TGEvent) => {
    setTGEventList([...tgEventList, newTGEvent]);
    setNewTGEventName('');
    setTGEvent(newTGEvent);
  }

  const removeTGEvent = (index: number) => {
    const removedTGEvent = tgEventList[index];
    setTGEventList(tgEventList.filter((e) => e !== removedTGEvent));
    if (removedTGEvent === tgEvent && tgEventList.length > 1) {
      setTGEvent(tgEventList[index - 1]);
    } else if (removedTGEvent === tgEvent && tgEventList.length === 1) {
      const newTGEvent = createNewTGEvent('新規イベント１', []); 
      setTGEventList([newTGEvent]);
      setTGEvent(newTGEvent);
    }
  };

  const copyTGEvent = (index: number) => {
    const tgEventToCopy = tgEventList[index];
    const copiedTGEvent = createNewTGEvent(`${tgEventToCopy.name} (コピー)`, [...tgEventToCopy.playerList]);
    setTGEventList([...tgEventList, copiedTGEvent]);
    setTGEvent(copiedTGEvent);
  };

  const startEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingName(name);
  };

  const saveEditing = (index: number) => {
    const updatedTGEventList = [...tgEventList];
    updatedTGEventList[index].name = editingName;
    setTGEventList(updatedTGEventList);
    setEditingIndex(null);
    setEditingName('');
  };

  return (
    <Box sx={{ width: 250, padding: 2 }}>
        <TextField
        label="新しいイベント"
        value={newTGEventName}
        onChange={(e) => setNewTGEventName(e.target.value)}
        fullWidth
        />
        <Button onClick={craeteNewTGEvent} variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
        追加
        </Button>
        <List>
        {tgEventList.map((tgEvent, index) => (
            <ListItem key={index} button>
                {editingIndex === index ? (
                  <TextField
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveEditing(index)}
                    fullWidth
                  />
                ) : (
                  <ListItemText primary={tgEvent.name} onClick={() => setTGEvent(tgEvent)} onDoubleClick={() => startEditing(index, tgEvent.name)} />
                )}
                <IconButton onClick={() => copyTGEvent(index)} sx={{ color: 'blue' }}>
                    <FileCopyIcon />
                </IconButton>
                <IconButton onClick={() => removeTGEvent(index)} sx={{ color: 'red' }}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        ))}
        </List>
    </Box>
  );
};