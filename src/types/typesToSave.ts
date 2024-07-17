import { BaseTeam, ChildrenTypes, Player } from "./types";

export interface TGEventToSave {
    id: string;
    name: string;
    playerList: PlayerToSave[];
    results: ResultToSave[];
  }
  
  export interface PlayerToSave {
    id: string;
    name: string;
  }

  export interface ResultToSave {
    id: string;
    name: string;
    team: TeamToSave;
    remainedPlayerIds: string[];
    confirmed: boolean;
  }
  
  export interface TeamHasTeamsToSave extends BaseTeam {
    childrenType: typeof ChildrenTypes.TEAM;
    children: TeamToSave[];
  }

  export interface TeamHasPlayersToSave extends BaseTeam {
    childrenType: typeof ChildrenTypes.PLAYER;
    children: string[];
  }
  
  export type TeamToSave = TeamHasTeamsToSave | TeamHasPlayersToSave;