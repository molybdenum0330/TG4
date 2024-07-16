import { v4 as uuidv4 } from 'uuid';
import { Player, TGEvent } from './types/types';  
import { TGEventProvider } from './context/TGEventContext';
import { TGEventListProvider } from './context/TGEventListContext';
import Content from './Content';
import { createNewTGEvent } from './types/types';
import { useEffect } from 'react';
import { restore } from './storage/tgList';

const initialize = () => {
  const tgEventList = restore();
  if (tgEventList.length !== 0) {
    return tgEventList;
  }
  const initialPlayerList: Player[] = Array.from({ length: 30 }, (_, index) => ({
    id: uuidv4(),
    name: `${index + 1}`,
    playedCount: 0,
  }))
  
  return [createNewTGEvent('新規イベント１', initialPlayerList)]
}

const initialTGEventList = initialize();

const App = () => {
  return (
    <TGEventProvider tgEvent={initialTGEventList[0]}>
      <TGEventListProvider tgEventList={initialTGEventList}>
        <Content/>
      </TGEventListProvider>
    </TGEventProvider>
  );
};

export default App;