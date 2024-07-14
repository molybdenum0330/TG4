import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Divider, IconButton, Menu, MenuItem, TextField, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Player, Team } from '../types/types';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerArea from './DroppablePlayerArea';

const PlayerListCard = ({ team, setTeams }: { team: Team, setTeams: React.Dispatch<React.SetStateAction<Team[]>> }) => {
  const [teamCount, setTeamCount] = useState<number>(2);
  const [playerCount, setPlayerCount] = useState<number>(4);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const splitPlayers = (newTeamsFunc: (shuffledPlayers: Player[]) => Team[]) => {
    const shuffledPlayers = [...team.children as Player[]].sort(() => Math.random() - 0.5);
    team.children = newTeamsFunc(shuffledPlayers);
    team.childrenType = 'Team';
    setTeams((prev) => [...prev]);
    handleMenuClose();
  }

  const splitByPlayerCount = () => {
    splitPlayers((shuffledPlayers) => {
      const newTeams: Team[] = [];
      shuffledPlayers.forEach((player, index) => {
        if (newTeams.length === 0 || newTeams[newTeams.length - 1].children.length >= playerCount) {
          newTeams.push({ id: index + 1, name: `チーム${index + 1}`, children: [] as Player[], childrenType: 'Player' });
        }
        (newTeams[newTeams.length - 1].children as Player[]).push(player);
      });
      return newTeams;
    })
  };

  const splitByTeamCount = () => {
    splitPlayers((shuffledPlayers) => {
      const newTeams: Team[] = Array.from({ length: teamCount }, (_, index) => ({ id: index + 1, name: `チーム${index + 1}`, children: [] as Player[], childrenType: 'Player' }));
      shuffledPlayers.forEach((player, index) => {
        (newTeams[index % teamCount].children as Player[]).push(player);
      });
      return newTeams;
    });
  };

  const addPlayer = (player: Player) => {
    (team.children as Player[]).push(player);
    setTeams((prev) => [...prev]);
  };

  const removePlayer = (player: Player) => {
    team.children = (team.children as Player[]).filter((p) => p.id !== player.id);
    setTeams((prev) => [...prev]);
  };

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={team.name}
        action={
          team.children.length === 1 ? null :
          <>
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              >
              <MenuItem disableRipple>
              <IconButton onClick={() => splitByPlayerCount()}>
                  <PlayArrowIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                  size="small"
                  sx={{ marginLeft: 1, width: '60px' }}
                />
                人ずつ分ける
              </MenuItem>

              <MenuItem disableRipple>
                <IconButton onClick={() => splitByTeamCount()}>
                  <PlayArrowIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={teamCount}
                  onChange={(e) => setTeamCount(parseInt(e.target.value))}
                  size="small"
                  sx={{ marginLeft: 1, width: '60px' }}
                />
                チームに分ける
              </MenuItem>
            </Menu>
          </>
        }/>
      <Divider />
      <CardContent
        sx={{
          flex: 1, // CardContentをCard全体に広げる
          display: 'flex', // 子要素を配置するためにflexを使用
          alignItems: 'center', // 子要素を中央に配置
          justifyContent: 'center', // 子要素を中央に配置
        }}
      >
        <DroppablePlayerArea onDrop={addPlayer}>
          <Stack
            direction="row" 
            spacing={2}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            useFlexGap
          >
            {
              (team.children as Player[]).map((player: Player) => (
                <DraggablePlayerCard key={player.id} player={player} dropCallback={removePlayer} />
              ))
            }
          </Stack>
        </DroppablePlayerArea>
      </CardContent>
    </Card>
  );
}

export default PlayerListCard;