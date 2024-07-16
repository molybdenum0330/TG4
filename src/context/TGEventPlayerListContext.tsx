import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react';
import { Player, TGEvent, countPlayed, syncPlayerListAndResults } from '../types/types';

interface TGEventPlayerListContextType {
  playerList: Player[];
  setPlayerList: React.Dispatch<React.SetStateAction<Player[]>>;
  observeChanged: () => void;
}

const TGEventPlayerListContext = createContext<TGEventPlayerListContextType>({
  playerList: [],
  setPlayerList: () => {},
  observeChanged: () => {},
});

export const useTGEventPlayerListContext = () => {
  const context = useContext(TGEventPlayerListContext);

  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }

  return context;
};

export const TGEventPlayerListProvider = ({ tgEvent, updateTGView, children }: PropsWithChildren<{ tgEvent: TGEvent, updateTGView: () => void }>) =>  {
  const applyPlayerList = () => {
    syncPlayerListAndResults(tgEvent);
    countPlayed(tgEvent);
  }

  const [playerList, setPlayerList] = useState<Player[]>(tgEvent.playerList);
  const observeChanged = () => {
    applyPlayerList()
    updateTGView();
  }

  useEffect(() => {
    tgEvent.playerList = playerList;
    applyPlayerList()
    updateTGView()
  }, [playerList])


  return (
    <TGEventPlayerListContext.Provider value={{ playerList, setPlayerList, observeChanged }}>
      {children}
    </TGEventPlayerListContext.Provider>
  );
}