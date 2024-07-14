import { useState } from 'react';
import { Team } from '../types/types';
import PlayerListCard from './PlayerListCard';
import TeamListCard from './TeamListCard';

const TeamCard = ({ team }: { team: Team }) => {
  const [teams, setTeams] = useState<Team[]>(team.childrenType === 'Team' ? team.children as Team[] : []);

  return team.childrenType === 'Team' ? (
    <TeamListCard team={team} setTeams={setTeams} />
  ) : (
    <PlayerListCard team={team} setTeams={setTeams} />
  );
}

export default TeamCard;