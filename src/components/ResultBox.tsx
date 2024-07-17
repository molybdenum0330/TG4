import { forwardRef, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Stack, Typography, TextField } from '@mui/material';
import { Player, Result, Team, sortByName, sortPlayer } from '../types/types';
import TeamCard from './TeamCard';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerArea from './DroppablePlayerArea';
import PlayerCard from './PlayerCard';
import { useTGEventPlayerListContext } from '../context/TGEventPlayerListContext';
import { useLockedContext } from '../context/LockContext';
import { Lock, LockOpen, Delete, Edit } from '@mui/icons-material';

const ResultBox = forwardRef<HTMLDivElement, { result: Result, onRemoveClick: () => void }>(({ result, onRemoveClick }, ref) => {
  const { observeChanged } = useTGEventPlayerListContext();
  const { locked, setLocked } = useLockedContext();
  const [name, setName] = useState(result.name);
  const [confirmed, setConfirmed] = useState(result.confirmed);
  const [remainedPlayers, setRemainedPlayers] = useState<Player[]>(result.remainedPlayers);
  const [previewPlayer, setPreviewPlayer] = useState<Player | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const addPlayer = (player: Player) => {
    setRemainedPlayers((prev) => {
      const players = sortPlayer([...prev, player])
      result.remainedPlayers = players
      return players;
    });
  };

  const removePlayer = (player: Player) => {
    setRemainedPlayers((prev) => {
      const players = prev.filter((p) => p !== player)
      result.remainedPlayers = players
      return players;
    });
  };

  const updateConfirmed = (confirmed: boolean) => {
    result.confirmed = confirmed
    setConfirmed(confirmed)
    observeChanged()
  };

  const onHoverPlayer = (player: Player, isOver: boolean) => {
    if (isOver) {
      setPreviewPlayer(player);
    } else {
      setPreviewPlayer(null);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
  };

  const handleBlur = () => {
    if (name) {
      result.name = name
      observeChanged();
    }
    setIsEditing(false);
    setName(name || result.name);
  };

  const cardPlayers = remainedPlayers.map(p => ({ player: p, isPreview: false }))
  previewPlayer && !remainedPlayers.includes(previewPlayer) && cardPlayers.push({ player: previewPlayer, isPreview: true })

  const sortedCardPlayers = sortByName(cardPlayers, (p) => p.player.name);

  return (
    <Card ref={ref} variant="outlined" sx={{ maxWidth: '100%', minWidth: '100%', margin: '0 auto'}}>
      <CardHeader
        title={
          isEditing ? (
            <TextField
              value={name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              autoFocus
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            />
          ) : (
            <Stack direction="row" spacing={2}>
              <Typography variant="h5">
                {name}
              </Typography>
              {locked ? null : (
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )
        }
        action={
          <Stack direction="row" spacing={2} flexGrow={1}>
            {confirmed ? (
              <IconButton onClick={() => updateConfirmed(false)}>
                <Lock />
              </IconButton>
            ) : (
              <IconButton onClick={() => updateConfirmed(true)}>
                <LockOpen />
              </IconButton>
            )}
            <IconButton onClick={onRemoveClick}>
              <Delete />
            </IconButton>
          </Stack>
        }
      />
      <CardContent sx={{opacity: locked ? 0.5 : 1 }}>
        <Stack spacing={2}>
          <TeamCard resultId={result.id} team={result.team} />
          <Card variant="outlined">
            <CardHeader title="不参加" />
            <Divider />
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {
                locked
                  ? <Box
                      sx={{
                        padding: '16px',
                        flexGrow: 1,
                        boxSizing: 'border-box',
                      }}>
                      <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                        {sortPlayer(remainedPlayers).map(p => <Box key={p.id}><PlayerCard player={p} /></Box>)}
                      </Stack>
                    </Box>
                  : <DroppablePlayerArea dndId={result.id} onDrop={addPlayer} onHover={onHoverPlayer}>
                      <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                        {sortedCardPlayers.map(({player, isPreview}) => (
                          isPreview
                            ? <Box key={`${player.id}-preview`} style={{opacity: 0.5}}><PlayerCard player={player} /></Box>
                            : <DraggablePlayerCard dndId={result.id} key={player.id} player={player} dropCallback={removePlayer} />
                        ))}
                      </Stack>
                    </DroppablePlayerArea>
              }
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default ResultBox;