import { useState } from 'react';
import { Card, CardHeader, CardContent, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UndoIcon from '@mui/icons-material/Undo';
import { Team, Player } from '../types/types';
import TeamCard from './TeamCard';

const TeamListCard = ({ team, setTeams }: { team: Team, setTeams: React.Dispatch<React.SetStateAction<Team[]>> }) => {
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
    setTeams((prev) => [...prev]);
    handleMenuClose();

    function collectPlayers(team: Team): Player[] {
      return team.childrenType === 'Team'
        ? (team.children as Team[]).flatMap((team) => collectPlayers(team))
        : (team.children as Player[]);
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={team.name}
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
      <CardContent sx={{ flex: 1 }}>
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

export default TeamListCard;