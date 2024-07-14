import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react';
import { TGEvent } from '../types/types';

interface TGEventListContextType {
  tgEventList: TGEvent[];
  setTGEventList: React.Dispatch<React.SetStateAction<TGEvent[]>>;
}

const TGEventListContext = createContext<TGEventListContextType>({
  tgEventList: [],
  setTGEventList: () => {},
});

export const TGEventListProvider = ({ tgEventList: initialTGEventList, children }: PropsWithChildren<{ tgEventList: TGEvent[] }>) =>  {
  const [tgEventList, setTGEventList] = useState<TGEvent[]>(initialTGEventList);
  return (<TGEventListContext.Provider value={{ tgEventList, setTGEventList }}>{children}</TGEventListContext.Provider>);
}

export const useTGEventListContext = () => {
  const context = useContext(TGEventListContext);

  if (!context) {
    throw new Error('useTGEventContext must be used within a TGEventProvider');
  }

  return context;
};
