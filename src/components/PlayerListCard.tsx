import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Divider, IconButton, Menu, MenuItem, TextField, Stack, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ChildrenTypes, Player, Team, TeamHasPlayers, sortByName, sortPlayer } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerArea from './DroppablePlayerArea';
import PlayerCard from './PlayerCard';
import { useLockedContext } from '../context/LockContext';

const PlayerListCard = ({resultId, team, updateView }: { resultId: string, team: Team, updateView: () => void }) => {
  const teamHasPlayer = team as TeamHasPlayers;
  const { locked } = useLockedContext();
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

  const splitPlayers = (newTeamsFunc: (shuffledPlayers: Player[]) => TeamHasPlayers[]) => {
    const shuffledPlayers = [...teamHasPlayer.children].sort(() => Math.random() - 0.5);
    team.children = newTeamsFunc(shuffledPlayers);
    team.childrenType = ChildrenTypes.TEAM;
    updateView();
    handleMenuClose();
  }

  const splitByPlayerCount = () => {
    splitPlayers((shuffledPlayers) => {
      const newTeams: TeamHasPlayers[] = [];
      shuffledPlayers.forEach((player, index) => {
        if (newTeams.length === 0 || newTeams[newTeams.length - 1].children.length >= playerCount) {
          newTeams.push({ id: uuidv4(), name: `T${newTeams.length + 1}`, children: [], childrenType: ChildrenTypes.PLAYER });
        }
        newTeams[newTeams.length - 1].children = sortPlayer([...newTeams[newTeams.length - 1].children, player]);
      });
      return newTeams;
    })
  };

  const splitByTeamCount = () => {
    splitPlayers((shuffledPlayers) => {
      const newTeams: TeamHasPlayers[] = Array.from({ length: teamCount }, (_, index) => ({ id: uuidv4(), name: `チーム${index + 1}`, children: [], childrenType: ChildrenTypes.PLAYER }));
      shuffledPlayers.forEach((player, index) => {
        (newTeams[index % teamCount].children).push(player);
      });

      newTeams.forEach((newTeam) => {
        newTeam.children = sortPlayer(newTeam.children);
      });
      return newTeams;
    });
  };

  const addPlayer = (player: Player) => {
    team.children = sortPlayer([...teamHasPlayer.children, player]);
    updateView();
  };

  const removePlayer = (player: Player) => {
    team.children = teamHasPlayer.children.filter((p) => p.id !== player.id);
    updateView();
  };

  const onHoverPlayer = (player: Player, isOver: boolean) => {
    if (player && isOver) {
      setPreviewPlayer(player);
    } else {
      setPreviewPlayer(null);
    }
  };

  const players = teamHasPlayer.children.map(p => ({ player: p, isPreview: false }))
  previewPlayer && !teamHasPlayer.children.includes(previewPlayer) && players.push({ player: previewPlayer, isPreview: true })

  const sortedPlayers = sortByName(players, (p) => p.player.name);

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={teamHasPlayer.name}
        action={
          locked ? null :
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
        {locked
          ? <Box
              sx={{
                padding: '16px',
                flexGrow: 1, // 親のflexコンテナ内でエリアいっぱいに広げる
                boxSizing: 'border-box', // paddingを含めてサイズを計算
              }}>
              <Stack
                direction="row" 
                spacing={2}
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                useFlexGap>
                {sortPlayer(teamHasPlayer.children).map(p => <Box key={p.id}><PlayerCard player={p} /></Box>)}
              </Stack>
            </Box>
          : <DroppablePlayerArea dndId={resultId} onDrop={addPlayer} onHover={onHoverPlayer}>
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
                    ? <Box style={{opacity: 0.5}}><PlayerCard key={`${player.id}-preview`} player={player} /></Box>
                    : <DraggablePlayerCard dndId={resultId} key={player.id} player={player} dropCallback={removePlayer} />
                  ))
                }
              </Stack>
            </DroppablePlayerArea>
}
      </CardContent>
    </Card>
  );
}

export default PlayerListCard;