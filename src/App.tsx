import { v4 as uuidv4 } from 'uuid';
import { Player, TGEvent } from './types/types';  
import { TGEventProvider } from './context/TGEventContext';
import { TGEventListProvider } from './context/TGEventListContext';
import Content from './Content';
import { createNewTGEvent } from './types/types';

const initialPlayerList: Player[] = Array.from({ length: 30 }, (_, index) => ({
  id: uuidv4(),
  name: `${index + 1}`,
  playedCount: 0,
}))

const initialTGEventList: TGEvent[] = [createNewTGEvent('新規イベント１', initialPlayerList)]

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