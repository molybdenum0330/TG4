import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography, } from '@mui/material';
import { Player, Result, Team, sortPlayer } from '../types/types';
import TeamCard from './TeamCard';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerArea from './DroppablePlayerArea';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MultiBackend, TouchTransition } from 'react-dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';


const ResultBox = ({ result }: { result: Result }) => {
  const [confirmed, setConfirmed] = useState(result.confirmed);
  const [teams, setTeams] = useState<Team[]>(result.teams);
  const [remainedPlayers, setRemainedPlayers] = useState<Player[]>(result.remainedPlayers);

  useEffect(() => {
    result.teams = teams;
    result.remainedPlayers = remainedPlayers;
    result.confirmed = confirmed;
  }, [teams, remainedPlayers, confirmed]);

  const addPlayerToRemained = (player: Player) => {
    setRemainedPlayers((prev) => sortPlayer([...prev, player]));
  };

  const removePlayerFromRemained = (player: Player) => {
    setRemainedPlayers((prev) => prev.filter((p) => p.id !== player.id));
  };

  return (
    <DndProvider
      backend={MultiBackend}
      options={{
        backends: [
          {
            backend: HTML5Backend,
          },
          {
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition,
          },
        ],
      }}>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            {teams.map((team) => (
              <Grid item xs key={team.id}>
                <TeamCard team={team} />
              </Grid>
            ))}
            <Card variant="outlined">
              <CardHeader title="不参加" />
              <Divider />
              <CardContent 
                sx={{
                  display: 'flex', // 子要素を配置するためにflexを使用
                  alignItems: 'center', // 子要素を中央に配置
                  justifyContent: 'center', // 子要素を中央に配置
                }}>
                <DroppablePlayerArea onDrop={addPlayerToRemained}>
                  <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                    {remainedPlayers.map((player) => (
                      <DraggablePlayerCard key={player.id} player={player} dropCallback={removePlayerFromRemained} />
                    ))}
                  </Stack>
                </DroppablePlayerArea>
              </CardContent>
            </Card>
            {confirmed ? (
              <Button variant="contained" color="secondary" onClick={() => setConfirmed(false)}>
                編集
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={() => setConfirmed(true)}>
                確定
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </DndProvider>
  );
};

export default ResultBox;