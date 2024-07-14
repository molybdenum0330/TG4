import { Player, TGEvent } from './types/types';  
import { TGEventProvider } from './context/TGEventContext';
import { TGEventListProvider } from './context/TGEventListContext';
import Content from './Content';

const initialPlayerList: Player[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `プレイヤー${index + 1}`,
  playedCount: 0,
}))

const initialTGEventList: TGEvent[] = [{
  id: 1,
  name: '新規イベント１',
  playerList: initialPlayerList,
  results: [
    {
      id: 1,
      teams: [
        {id: 1, name: 'チーム１', children: initialPlayerList.slice(0, initialPlayerList.length / 2), childrenType: 'Player'}
      ],
      remainedPlayers: initialPlayerList.slice(initialPlayerList.length / 2, initialPlayerList.length),
      confirmed: false
    }
  ],
}]

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