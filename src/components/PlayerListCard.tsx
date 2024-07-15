import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Divider, IconButton, Menu, MenuItem, TextField, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Player, Team, sortByName, sortPlayer } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerArea from './DroppablePlayerArea';
import PlayerCard from './PlayerCard';

const PlayerListCard = ({ team, setTeams }: { team: Team, setTeams: React.Dispatch<React.SetStateAction<Team[]>> }) => {
  const [teamCount, setTeamCount] = useState<number>(2);
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [previewPlayer, setPreviewPlayer] = useState<Player | null>(null);

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
          newTeams.push({ id: uuidv4(), name: `チーム${newTeams.length + 1}`, children: [] as Player[], childrenType: 'Player' });
        }
        newTeams[newTeams.length - 1].children = sortPlayer([...newTeams[newTeams.length - 1].children as Player[], player]);
      });
      return newTeams;
    })
  };

  const splitByTeamCount = () => {
    splitPlayers((shuffledPlayers) => {
      const newTeams: Team[] = Array.from({ length: teamCount }, (_, index) => ({ id: uuidv4(), name: `チーム${index + 1}`, children: [] as Player[], childrenType: 'Player' }));
      shuffledPlayers.forEach((player, index) => {
        (newTeams[index % teamCount].children as Player[]).push(player);
      });

      newTeams.forEach((team) => {
        team.children = sortPlayer(team.children as Player[]);
      });
      return newTeams;
    });
  };

  const addPlayer = (player: Player) => {
    team.children = sortPlayer([...team.children as Player[], player]);
    setTeams((prev) => [...prev]);
  };

  const removePlayer = (player: Player) => {
    team.children = (team.children as Player[]).filter((p) => p.id !== player.id);
    setTeams((prev) => [...prev]);
  };

  const onHoverPlayer = (player: Player, isOver: boolean) => {
    if (player && isOver) {
      setPreviewPlayer(player);
    } else {
      setPreviewPlayer(null);
    }
  };

  const players = (team.children as Player[]).map(p => ({ player: p, isPreview: false }))
  previewPlayer && !(team.children as Player[]).includes(previewPlayer) && players.push({ player: previewPlayer, isPreview: true })

  const sortedPlayers = sortByName(players, (p) => p.player.name);

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
        <DroppablePlayerArea onDrop={addPlayer} onHover={onHoverPlayer}>
          <Stack
            direction="row" 
            spacing={2}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            useFlexGap
          >
            {
              sortedPlayers.map(({player, isPreview}) => (
                isPreview
                ? <div style={{opacity: 0.5}}><PlayerCard key={`${player.id}-preview`} player={player} /></div>
                : <DraggablePlayerCard key={player.id} player={player} dropCallback={removePlayer} />
              ))
            }
          </Stack>
        </DroppablePlayerArea>
      </CardContent>
    </Card>
  );
}

export default PlayerListCard;