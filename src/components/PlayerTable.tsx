import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Grid, IconButton, Drawer, useMediaQuery, AppBar, Toolbar, Typography } from '@mui/material';
import { Player } from '../types/types';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

const initialPlayers: Player[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: '',
  participationCount: 0,
}));

const PlayerTable: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editField, setEditField] = useState<{ id: number | null, field: string | null }>({ id: null, field: null });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const handleNameChange = (id: number, name: string) => {
    setPlayers(players.map(player => player.id === id ? { ...player, name } : player));
  };

  const handleParticipationChange = (id: number, participationCount: number) => {
    setPlayers(players.map(player => player.id === id ? { ...player, participationCount } : player));
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: players.length ? players[players.length - 1].id + 1 : 1,
      name: '',
      participationCount: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFocus = (id: number, field: string) => {
    setEditField({ id, field });
  };

  const handleBlur = () => {
    setEditField({ id: null, field: null });
  };

  const playerTableContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid container spacing={2} style={{ marginBottom: '16px' }}>
        <Grid item>
          <Button id="add-player-button" variant="contained" color="primary" onClick={addPlayer}>
            プレイヤー追加
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>プレイヤー名</TableCell>
              <TableCell>参加回数</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map(player => (
              <TableRow key={player.id} style={{ height: '40px' }} id={`player-row-${player.id}`}>
                <TableCell>{player.id}</TableCell>
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
                  {editField.id === player.id && editField.field === 'participationCount' ? (
                    <TextField
                      id={`player-participationCount-${player.id}`}
                      type="number"
                      value={player.participationCount}
                      onChange={(e) => handleParticipationChange(player.id, parseInt(e.target.value))}
                      onBlur={handleBlur}
                      autoFocus
                      size="small"
                    />
                  ) : (
                    <span
                      id={`edit-player-participationCount-${player.id}`}
                      onClick={() => handleFocus(player.id, 'participationCount')}
                    >
                      {player.participationCount}
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
      {isSmallScreen ? (
        <>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                プレイヤーテーブル
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
            <div style={{ width: 250 }}>
              <IconButton onClick={toggleDrawer}>
                <CloseIcon />
              </IconButton>
              {playerTableContent}
            </div>
          </Drawer>
        </>
      ) : (
        playerTableContent
      )}
    </div>
  );
};

export default PlayerTable;