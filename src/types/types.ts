import { v4 as uuidv4 } from 'uuid';

export const ChildrenTypes = {
  Team: 'Team',
  Player: 'Player'
} as const;

export type ChildrenType = typeof ChildrenTypes[keyof typeof ChildrenTypes];

export interface TGEvent {
  id: string;
  name: string;
  playerList: Player[];
  results: Result[];
}

export interface Player {
  id: string;
  name: string;
  playedCount: number;
}

export interface Result {
  id: string;
  teams: Team[];
  remainedPlayers: Player[];
  confirmed: boolean;
}

export interface BaseTeam {
  id: string;
  name: string;
  childrenType: ChildrenType;
}

export interface TeamWHasTeams extends BaseTeam {
  childrenType: typeof ChildrenTypes.Team;
  children: Team[];
}

export interface TeamWHasPlayers extends BaseTeam {
  childrenType: typeof ChildrenTypes.Player;
  children: Player[];
}

export type Team = TeamWHasTeams | TeamWHasPlayers;

export const DroppableTypes = {
  PLAYER: 'player',
};

export type PlayerDropItem = {
  player: Player;
  dropCallback: (player: Player) => void
}

export const createNewTGEvent = (name: string, playerList: Player[]) => ({id: uuidv4(), name: name, playerList: playerList, results: [createNewUncofirmedResult(playerList)]});
export const createNewUncofirmedResult = (playerList: Player[]) => ({id: uuidv4(), teams: [createParticipatingTeam(playerList)], remainedPlayers: [], confirmed: false});
const createParticipatingTeam = (playerList: Player[]) => ({id: uuidv4(), name: '参加', children: playerList, childrenType: ChildrenTypes.Player}) as TeamWHasPlayers;

export const sortPlayer = (players: Player[]) => sortByName(players, (player) => player.name);
export const sortByName = <T>(target: T[], nameGetter: (item: T) => string) => target.sort((a, b) => nameGetter(a).localeCompare(nameGetter(b), undefined, {numeric: true}));