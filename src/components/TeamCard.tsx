import { useState } from 'react';
import { ChildrenTypes, Team } from '../types/types';
import PlayerListCard from './PlayerListCard';
import TeamListCard from './TeamListCard';

const TeamCard = ({resultId,  team }: { resultId: string, team: Team }) => {
  const [toggle, setToggle] = useState(true);

  const updateView = () => {
    setToggle(!toggle);
  }

  return team.childrenType === ChildrenTypes.TEAM ? (
    <TeamListCard resultId={resultId} team={team} updateView={updateView} />
  ) : (
    <PlayerListCard resultId={resultId} team={team} updateView={updateView}  />
  );
}

export default TeamCard;