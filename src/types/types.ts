export interface Player {
  id: number;
  name: string;
  participationCount: number;
}

export interface Team {
  id: number;
  children: Team[] | Player[];
  childrenType: 'Team' | 'Player';
}
