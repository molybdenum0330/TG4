import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../types/types';
import { usePlayerListContext } from '../context/PlayerListContext';

const PlayerTable = () => {
  const { playerList, setPlayerList } = usePlayerListContext();
  const [editField, setEditField] = useState<{ id: string | null, field: string | null }>({ id: null, field: null });
  const [saveName, setSaveName] = useState('');

  const handleNameChange = (id: string, name: string) => {
    setPlayerList(playerList.map(player => player.id === id ? { ...player, name } : player));
  };

  const handlePlayedChange = (id: string, playedCount: number) => {
    setPlayerList(playerList.map(player => player.id === id ? { ...player, playedCount } : player));
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: uuidv4(),
      name: 'プレイヤー' + (playerList.length + 1),
      playedCount: 0,
    };
    setPlayerList([...playerList, newPlayer]);
  };

  const removePlayer = (id: string) => {
    setPlayerList(playerList.filter(player => player.id !== id));
  };

  const handleFocus = (id: string, field: string) => {
    setEditField({ id, field });
  };

  const handleBlur = () => {
    setEditField({ id: null, field: null });
  };

  const handleSave = () => {
    console.log(`Saving player list as: ${saveName}`);
    // Implement the actual save logic here
  };

  const playerTableContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid container spacing={2} style={{ marginBottom: '16px' }}>
        <Grid item>
          <Button id="add-player-button" variant="contained" color="primary" onClick={addPlayer}>
            プレイヤー追加
          </Button>
        </Grid>
        <Grid item>
          <TextField
            label="Save Name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Player List
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>プレイヤー名</TableCell>
              <TableCell>参加回数</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playerList.map(player => (
              <TableRow key={player.id} style={{ height: '40px' }} id={`player-row-${player.id}`}>
                <TableCell>
                  {editField.id === player.id && editField.field === 'name' ? (
                    <TextField
                      id={`player-name-${player.id}`}
                      value={player.name}
                      onChange={(e) => handleNameChange(player.id, e.target.value)}
                      onBlur={handleBlur}
                      autoFocus
                      size="small"
                      InputProps={{
                        style: { fontSize: '14px' }
                      }}
                      placeholder="クリックして編集"
                      InputLabelProps={{
                        style: { color: 'rgba(0, 0, 0, 0.54)' }
                      }}
                    />
                  ) : (
                    <span
                      id={`edit-player-name-${player.id}`}
                      onClick={() => handleFocus(player.id, 'name')}
                      style={{ color: player.name ? 'inherit' : 'rgba(0, 0, 0, 0.54)' }}
                    >
                      {player.name || 'クリックして編集'}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editField.id === player.id && editField.field === 'playedCount' ? (
                    <TextField
                      id={`player-playedCount-${player.id}`}
                      type="number"
                      value={player.playedCount}
                      onChange={(e) => handlePlayedChange(player.id, parseInt(e.target.value))}
                      onBlur={handleBlur}
                      autoFocus
                      size="small"
                    />
                  ) : (
                    <span
                      id={`edit-player-playedCount-${player.id}`}
                      onClick={() => handleFocus(player.id, 'playedCount')}
                    >
                      {player.playedCount}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton id={`delete-player-${player.id}`} color="error" onClick={() => removePlayer(player.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div style={{ height: '100vh' }}>
      {playerTableContent}
    </div>
  );
};

export default PlayerTable;