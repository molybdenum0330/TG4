export interface TGEvent {
  id: number;
  name: string;
  playerList: Player[];
  results: Result[];
}

export interface Player {
  id: number;
  name: string;
  playedCount: number;
}

export interface Result {
  id: number;
  teams: Team[];
  remainedPlayers: Player[];
  confirmed: boolean;
}

export interface Team {
  id: number;
  name: string;
  children: Team[] | Player[];
  childrenType: 'Team' | 'Player';
}

export const DroppableTypes = {
  PLAYER: 'player',
};

export type PlayerDropItem = {
  player: Player;
  dropCallback: (player: Player) => void
}

export const sortPlayer = (players: Player[]) => sortByName(players, (player) => player.name);
export const sortByName = <T>(target: T[], nameGetter: (item: T) => string) => target.sort((a, b) => nameGetter(a).localeCompare(nameGetter(b), undefined, {numeric: true}));