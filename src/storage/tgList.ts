import { TGEvent, Team, Player, ChildrenTypes, countPlayed } from "../types/types";
import { TGEventToSave, TeamToSave } from "../types/typesToSave";

export const save = (tgEventList: TGEvent[]) => {
    const tgEventListToSave: TGEventToSave[] = tgEventList
        .map(tgEvent => ({
            ...tgEvent,
            playerList: tgEvent.playerList.map(({ playedCount, ...player }) => player),
            results: tgEvent.results.map(({ remainedPlayers, ...result }) => ({
                ...result,
                team: getTeamToSave(result.team),
                remainedPlayerIds: remainedPlayers.map(player => player.id)
            }))
        }));
    localStorage.setItem(`tgEvent`, JSON.stringify(tgEventListToSave));
}

const getTeamToSave = (team: Team): TeamToSave => {
    return team.childrenType === ChildrenTypes.PLAYER
        ? { ...team, children: team.children.map(child => child.id) }
        : { ...team, children: team.children.map(child => getTeamToSave(child)) }
}

export const restore = (): TGEvent[] => {
    const tgEvent = localStorage.getItem(`tgEvent`);
    const tgEventListRestored = tgEvent ? JSON.parse(tgEvent) as TGEventToSave[] : [];
    const tgEventList: TGEvent[] = tgEventListRestored
        .map(tgEvent => {
            const playerList = tgEvent.playerList.map(player => ({ ...player, playedCount: 0 })) as Player[];
            return {
                ...tgEvent,
                playerList,
                results: tgEvent
                    .results
                    .map(result => ({
                        ...result,
                        team: getTeamFromRestored(result.team, playerList),
                        remainedPlayers: playerList.filter(player => result.remainedPlayerIds.includes(player.id))
                    }))
            }
        });
    tgEventList.forEach(tgEvent => countPlayed(tgEvent));
    return tgEventList;
}

 const getTeamFromRestored = (team: TeamToSave, playerList: Player[]): Team => {
    return team.childrenType === ChildrenTypes.PLAYER
        ? { ...team, children: playerList.filter(player => team.children.includes(player.id)) }
        : { ...team, children: team.children.map(child => getTeamFromRestored(child, playerList)) }
}