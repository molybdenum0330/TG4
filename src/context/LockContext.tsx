import React, { createContext, useState, ReactNode, PropsWithChildren, useContext } from 'react';

interface LockedContextProps {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}


const LockedContext = createContext<LockedContextProps>({
  locked: false,
  setLocked: () => {},
});

export const LockedProvider = ({ locked: initialLocked, children }: PropsWithChildren<{locked: boolean}>) => {
  const [locked, setLocked] = useState<boolean>(initialLocked);

  return (
    <LockedContext.Provider value={{ locked, setLocked }}>
      {children}
    </LockedContext.Provider>
  );
};

export const useLockedContext = () => {
  const context = useContext(LockedContext);
  if (!context) {
    throw new Error('useLockedContext must be used within a LockedProvider');
  }
  return context;
}
