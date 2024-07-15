import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography, } from '@mui/material';
import { Player, Result, Team, sortByName, sortPlayer } from '../types/types';
import TeamCard from './TeamCard';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerArea from './DroppablePlayerArea';
import PlayerCard from './PlayerCard';


const ResultBox = ({ result, updateTGEventView }: { result: Result, updateTGEventView: () => void }) => {
  const [confirmed, setConfirmed] = useState(result.confirmed);
  const [remainedPlayers, setRemainedPlayers] = useState<Player[]>(result.remainedPlayers);
  const [previewPlayer, setPreviewPlayer] = useState<Player | null>(null);

  useEffect(() => {
    result.remainedPlayers = remainedPlayers;
    result.confirmed = confirmed;
  }, [remainedPlayers, confirmed]);

  const addPlayer = (player: Player) => {
    setRemainedPlayers((prev) => sortPlayer([...prev, player]));
  };

  const removePlayer = (player: Player) => {
    setRemainedPlayers((prev) => prev.filter((p) => p.id !== player.id));
  };

  const updateConfirmed = (confirmed: boolean) => {
    result.confirmed = confirmed
    setConfirmed(confirmed)
    updateTGEventView()
  };

  const onHoverPlayer = (player: Player, isOver: boolean) => {
    if (isOver) {
      setPreviewPlayer(player);
    } else {
      setPreviewPlayer(null);
    }
  };

  const cardPlayers = remainedPlayers.map(p => ({ player: p, isPreview: false }))
  previewPlayer && !remainedPlayers.includes(previewPlayer) && cardPlayers.push({ player: previewPlayer, isPreview: true })

  const sortedCardPlayers = sortByName(cardPlayers, (p) => p.player.name);

  return (
    <Card variant="outlined" sx={{ maxWidth: '100%', margin: '0 auto' }}>
      <CardContent>
        <Stack spacing={2}>
          <TeamCard resultId={result.id} team={result.team} />
          <Card variant="outlined">
            <CardHeader title="不参加" />
            <Divider />
            <CardContent
              sx={{
                display: 'flex', // 子要素を配置するためにflexを使用
                alignItems: 'center', // 子要素を中央に配置
                justifyContent: 'center', // 子要素を中央に配置
              }}>
              <DroppablePlayerArea dndId={result.id} onDrop={addPlayer} onHover={onHoverPlayer}>
                <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                  {sortedCardPlayers.map(({player, isPreview}) => (
                    isPreview
                      ? <div key={`${player.id}-preview`} style={{opacity: 0.5}}><PlayerCard player={player} /></div>
                      : <DraggablePlayerCard dndId={result.id} key={player.id} player={player} dropCallback={removePlayer} />
                  ))}
                </Stack>
              </DroppablePlayerArea>
            </CardContent>
          </Card>
          {confirmed ? (
            <Button variant="contained" color="secondary" onClick={() => updateConfirmed(false)}>
              編集
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={() => updateConfirmed(true)}>
              確定
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResultBox;