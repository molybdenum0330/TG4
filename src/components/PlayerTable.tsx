import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Grid, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../types/types';
import { usePlayerListContext } from '../context/PlayerListContext';

const PlayerTable = ({ updateTGEventView }: { updateTGEventView: () => void }) => {
  const { playerList, setPlayerList } = usePlayerListContext();
  const [editName, setEditName] = useState<Player | null>(null);
  const [editPlayerName, setEditPlayerName] = useState<string>("");
  const [playerName, setPlayerName] = useState('');

  const addPlayer = () => {
    const newPlayer: Player = {
      id: uuidv4(),
      name: playerName,
      playedCount: 0,
    };
    setPlayerList([...playerList, newPlayer]);
    setPlayerName('')
    updateTGEventView()
  };

  const removePlayer = (player: Player) => {
    if (player.playedCount > 0) {
      if (!window.confirm('このプレイヤーは参加回数が1以上です。本当に削除しますか？')) {
        return;
      }
    }
    setPlayerList(playerList.filter(p => p !== player));
    updateTGEventView();
  };

  const handleFocus = (player: Player) => {
    setEditName(player);
    setEditPlayerName(player.name || '')
  };

  const handleBlur = () => {
    if (editName) {
      editName.name = editPlayerName
    }
    setEditName(null);
    updateTGEventView()
  };

  const playerTableContent = (
    <Stack direction="column" sx={{ display: 'flex', height: '80%' }} gap={2}>
      <TableContainer component={Paper} style={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>プレイヤー名</TableCell>
              <TableCell>参加回数</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playerList.map(player => (
              <TableRow key={player.id} id={`player-row-${player.id}`}>
                <TableCell>
                  {editName === player ? (
                    <TextField
                      id={`player-name-${player.id}`}
                      value={editPlayerName}
                      onChange={(e) => setEditPlayerName(e.target.value)}
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
                      onClick={() => handleFocus(player)}
                      style={{ color: player.name ? 'inherit' : 'rgba(0, 0, 0, 0.54)' }}
                    >
                      {player.name || 'クリックして編集'}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {player.playedCount}
                </TableCell>
                <TableCell>
                  <IconButton id={`delete-player-${player.id}`} color="error" onClick={() => removePlayer(player)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={2} sx={{ marginBottom: '16px' }}>
        <TextField
          label="プレイヤー名"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <IconButton onClick={addPlayer}>
          <AddIcon />
        </IconButton>
      </Stack>
    </Stack>
  );

  return (
    <div style={{ height: '100vh' }}>
      {playerTableContent}
    </div>
  );
};

export default PlayerTable;