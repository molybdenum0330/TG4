import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography, } from '@mui/material';
import { Player, Result, Team } from '../types/types';
import TeamCard from './TeamCard';
import PlayerCard from './PlayerCard';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  PLAYER: 'player',
};

const DraggablePlayerCard = ({ player, movePlayer }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { player },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <PlayerCard player={player} />
    </div>
  );
};

const DroppableArea = ({ children, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    drop: (item) => onDrop(item.player),
  }));

  return <div ref={drop}>{children}</div>;
};

const ResultBox = ({ result }: { result: Result }) => {
  const [confirmed, setConfirmed] = useState(result.confirmed);
  const [teams, setTeams] = useState<Team[]>(result.teams);
  const [remainedPlayers, setRemainedPlayers] = useState<Player[]>(result.remainedPlayers);

  useEffect(() => {
    result.teams = teams;
    result.remainedPlayers = remainedPlayers;
    result.confirmed = confirmed;
  }, [teams, remainedPlayers, confirmed]);

  const movePlayerToTeam = (player, teamId) => {
    setRemainedPlayers((prev) => prev.filter((p) => p.id !== player.id));
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, players: [...team.players, player] } : team
      )
    );
  };

  const movePlayerToRemained = (player) => {
    setTeams((prev) =>
      prev.map((team) => ({
        ...team,
        players: team.players.filter((p) => p.id !== player.id),
      }))
    );
    setRemainedPlayers((prev) => [...prev, player]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            {teams.map((team) => (
              <Grid item xs key={team.id}>
                <DroppableArea onDrop={(player) => movePlayerToTeam(player, team.id)}>
                  <TeamCard team={team} />
                  {team.players.map((player) => (
                    <DraggablePlayerCard key={player.id} player={player} movePlayer={movePlayerToTeam} />
                  ))}
                </DroppableArea>
              </Grid>
            ))}
            <Card variant="outlined">
              <CardHeader title="不参加" />
              <Divider />
              <CardContent>
                <DroppableArea onDrop={movePlayerToRemained}>
                  <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                    {remainedPlayers.map((player) => (
                      <DraggablePlayerCard key={player.id} player={player} movePlayer={movePlayerToRemained} />
                    ))}
                  </Stack>
                </DroppableArea>
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