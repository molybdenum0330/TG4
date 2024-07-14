import { useState, useEffect } from 'react';
import { Button, TextField, Box, Container, Card, CardContent, Divider, Grid, Typography, Stack, CardHeader, CardActions, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UndoIcon from '@mui/icons-material/Undo';
import { Player, Team, Result } from '../types/types';
import PlayerCard from './PlayerCard';
import { usePlayerListContext } from '../context/PlayerListContext';

const TeamCard = ({team}: {team: Team}) => {
  const [teams, setTeams] = useState<Team[]>(team.childrenType === 'Team' ? team.children as Team[] : []);

  const PlayerListCard = () => {
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
      setTeams([...teams]);
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

    return (
      <Card variant="outlined">
        <CardHeader
          title={`Team ${team.id}`}
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
        <CardContent>
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center" alignItems="center" useFlexGap>
            {
              (team.children as Player[]).map((player: Player) => (
                <PlayerCard  key={(player).id}  player={player} />
              ))
            }
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const TeamListCard = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const revert = () => {
      team.children = collectPlayers(team);
      team.childrenType = 'Player';
      setTeams([...teams]);
      handleMenuClose();

      function collectPlayers(team: Team): Player[] {
        return team.childrenType === 'Team'
          ? (team.children as Team[]).flatMap((team) => collectPlayers(team))
          : (team.children as Player[]);
      }
    };

    return (
      <Card>
        <CardHeader
          title={`Team ${team.id}`}
          action={
            <>
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                >
                <MenuItem disableRipple onClick={() => revert()}>
                  <IconButton>
                    <UndoIcon />
                  </IconButton>
                  やり直す
                </MenuItem>
              </Menu>
            </>
          }/>
        <Divider />
        <CardContent>
          <Stack direction="row" spacing={5}>
            {
              (team.children as Team[]).map((subTeam: Team) => (
                <TeamCard key={subTeam.id} team={subTeam as Team} />
              ))
            }
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return team.childrenType === 'Team' ? <TeamListCard /> : <PlayerListCard />;
}


export default TeamCard;