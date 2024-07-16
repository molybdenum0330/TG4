import { AddToDriveRounded } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { resourceLimits } from 'worker_threads';

export const ChildrenTypes = {
  TEAM: 'Team',
  PLAYER: 'Player'
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
  team: Team;
  remainedPlayers: Player[];
  confirmed: boolean;
}


export interface ResultToSave {
  id: string;
  team: Team;
  remainedPlayerIds: string[];
  confirmed: boolean;
}

export interface BaseTeam {
  id: string;
  name: string;
  childrenType: ChildrenType;
}

export interface TeamHasTeams extends BaseTeam {
  childrenType: typeof ChildrenTypes.TEAM;
  children: Team[];
}

export interface TeamHasPlayers extends BaseTeam {
  childrenType: typeof ChildrenTypes.PLAYER;
  children: Player[];
}

export interface TeamHasPlayersToSave extends BaseTeam {
  childrenType: typeof ChildrenTypes.PLAYER;
  children: string[];
}

export type Team = TeamHasTeams | TeamHasPlayers;

export const DroppableTypes = {
  PLAYER: 'player',
};

export type PlayerDropItem = {
  dndId: string;
  player: Player;
  dropCallback: (player: Player) => void
}

export const createNewTGEvent = (name: string, playerList: Player[]) => ({id: uuidv4(), name: name, playerList: playerList, results: [createNewUncofirmedResult(playerList)]});
export const createNewUncofirmedResult = (playerList: Player[]) => ({id: uuidv4(), team: createParticipatingTeam(playerList), remainedPlayers: [], confirmed: false});
const createParticipatingTeam = (playerList: Player[]): TeamHasPlayers => ({id: uuidv4(), name: '参加', children: playerList, childrenType: ChildrenTypes.PLAYER});
export const collectPlayers = (team: Team): Player[] =>
  team.childrenType === ChildrenTypes.TEAM
    ? (team.children).flatMap((team) => collectPlayers(team))
    : (team.children);

export const syncPlayerListAndResults = (tgEvent: TGEvent) => {
  removeDeletedPlayersFromResults(tgEvent)
  addNewPlayer(tgEvent)
}

const removeDeletedPlayersFromResults = (tgEvent: TGEvent) => {
  tgEvent.results.forEach(r => {
    removePlayerDoesNotExist(r.team, tgEvent.playerList)
    r.remainedPlayers = r.remainedPlayers.filter(p => tgEvent.playerList.some(p2 => p2 === p))
})
}

const removePlayerDoesNotExist = (team: Team, playerList: Player[]) => {
  team.childrenType === ChildrenTypes.PLAYER
     ? team.children = team.children.filter(p => playerList.some(p2 => p2 === p))
     : team.children.forEach(t => removePlayerDoesNotExist(t, playerList))
}

const addNewPlayer = (tgEvent: TGEvent) => {
  // TODO
  tgEvent.results.forEach(r => {
    const existsPlayers = [...collectPlayers(r.team), ...r.remainedPlayers]
    const newPlayers = [...tgEvent.playerList.filter(p => !existsPlayers.some(p2 => p2 === p))]
    r.remainedPlayers.push(...newPlayers)
  })
}

export const countPlayed = (tgEvent: TGEvent) => {
  const players = tgEvent.playerList
  players.forEach(p => p.playedCount = 0)
  tgEvent.results
    .filter(r => r.confirmed)
    .forEach(result => collectPlayers(result.team).forEach(p => p.playedCount += 1))
  return players
};

export const sortPlayer = (players: Player[]) => sortByName(players, (player) => player.name);
export const sortByName = <T>(target: T[], nameGetter: (item: T) => string) => target.sort((a, b) => nameGetter(a).localeCompare(nameGetter(b), undefined, {numeric: true}));