import { useEffect, useState } from 'react';
import { Box, Button, Card, Grid, Stack, Typography, } from '@mui/material';
import { Player, Result, Team } from '../types/types';
import TeamCard from './TeamCard';
import PlayerCard from './PlayerCard';


const ResultBox = ({ result }: { result: Result }) => {
    //const { playerList } = usePlayerListContext();

    const [confirmed, setConfirmed] = useState(result.confirmed)
    const [teams, setTeams] = useState<Team[]>(result.teams);
    const [remainedPlayers, setRemainedPlayers] = useState<Player[]>(result.remainedPlayers);
    useEffect(() => {
      result.teams = teams;
      result.remainedPlayers = remainedPlayers;
      result.confirmed = confirmed;
    }, [teams, remainedPlayers, confirmed]);

    return (
        <Box>
            <Box>
                <Grid container spacing={2}>
                    {teams.map((team) => (
                        <Grid item xs key={team.id}>
                            <TeamCard team={team} />
                        </Grid>
                    ))}
                </Grid>
                <Card>
                    <Typography>残りのプレイヤー</Typography>
                    <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                        {remainedPlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
                    </Stack>
                </Card>
            </Box>
            {confirmed
             ? (<Button variant="contained" color="secondary" onClick={() => setConfirmed(false)}>
                    編集
                </Button>)
             : (            
                <Button variant="contained" color="secondary" onClick={() => setConfirmed(true)}>
                    確定
                </Button>
            )}
        </Box>
    );
};

export default ResultBox;