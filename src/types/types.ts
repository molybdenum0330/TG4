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
