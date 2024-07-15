import { useState } from 'react';
import { Card, CardHeader, CardContent, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UndoIcon from '@mui/icons-material/Undo';
import { Team, Player, ChildrenTypes, TeamHasTeams, collectPlayers } from '../types/types';
import TeamCard from './TeamCard';

const TeamListCard = ({ resultId, team, updateView }: { resultId: string, team: Team, updateView: () => void }) => {
  const teamHasTeams = team as TeamHasTeams;
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
    team.childrenType = ChildrenTypes.PLAYER;
    updateView();
    handleMenuClose();
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={teamHasTeams.name}
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
        <Stack direction="row" flexWrap="wrap" flexGrow={1} gap={1}>
          {
            teamHasTeams.children.map((subTeam: Team) => (
              <TeamCard resultId={resultId} key={subTeam.id} team={subTeam} />
            ))
          }
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TeamListCard;