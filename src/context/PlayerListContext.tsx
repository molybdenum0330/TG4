import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react';
import { Player, TGEvent } from '../types/types';

interface PlayerListContextType {
  playerList: Player[];
  setPlayerList: React.Dispatch<React.SetStateAction<Player[]>>;
}

const PlayerListContext = createContext<PlayerListContextType>({
  playerList: [],
  setPlayerList: () => {},
});

export const PlayerListProvider = ({ playerList: initialPlayerList, children }: PropsWithChildren<{ playerList: Player[] }>) =>  {
  const [playerList, setPlayerList] = useState<Player[]>(initialPlayerList);
  return (<PlayerListContext.Provider value={{ playerList, setPlayerList }}>{children}</PlayerListContext.Provider>);
}

export const usePlayerListContext = () => {
  const context = useContext(PlayerListContext);

  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }

  return context;
};

export const TGEventPlayerListProvider = ({ tgEvent, children }: PropsWithChildren<{ tgEvent: TGEvent }>) =>  {
  const SyncToTGEvent = ({children }: PropsWithChildren) => {
    const {playerList} = usePlayerListContext();
    
    useEffect(() => {
      tgEvent.playerList = playerList;
    }, [playerList]);
    return <>{children}</>
  }

  return (
    <PlayerListProvider playerList={tgEvent.playerList}>
      <SyncToTGEvent>{children}</SyncToTGEvent>
    </PlayerListProvider>
  );
}