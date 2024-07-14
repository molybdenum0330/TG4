import React, { createContext, useState, ReactNode, PropsWithChildren, useContext } from 'react';
import { TGEvent } from '../types/types';

interface TGEventContextProps {
  tgEvent: TGEvent;
  setTGEvent: React.Dispatch<React.SetStateAction<TGEvent>>;
}


const TGEventContext = createContext<TGEventContextProps>({
  tgEvent: undefined as unknown as TGEvent,
  setTGEvent: () => {},
});

export const TGEventProvider = ({ tgEvent: initialTGEvent, children }: PropsWithChildren<{tgEvent: TGEvent}>) => {
  const [tgEvent, setTGEvent] = useState<TGEvent>(initialTGEvent);

  return (
    <TGEventContext.Provider value={{ tgEvent, setTGEvent }}>
      {children}
    </TGEventContext.Provider>
  );
};

export const useTGEventContext = () => {
  const context = useContext(TGEventContext);
  if (!context) {
    throw new Error('useTGEventContext must be used within a TGEventProvider');
  }
  return context;
}
