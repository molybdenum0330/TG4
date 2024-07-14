import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Grid, Card, CardContent, Typography, Stack, CardHeader, CardActions } from '@mui/material';
import { Player, Team } from '../types/types';

const initialPlayers: Player[] = [
  { id: 1, name: 'Player 1', participationCount: 0 },
  { id: 2, name: 'Player 2', participationCount: 0 },
  { id: 3, name: 'Player 3', participationCount: 0 },
  { id: 4, name: 'Player 4', participationCount: 0 },
  { id: 5, name: 'Player 5', participationCount: 0 },
  { id: 6, name: 'Player 6', participationCount: 0 },
  { id: 7, name: 'Player 7', participationCount: 0 },
  { id: 8, name: 'Player 8', participationCount: 0 },
  { id: 9, name: 'Player 9', participationCount: 0 },
  { id: 10, name: 'Player 10', participationCount: 0 },
];

const initalTeams: Team[] = [{id: 1, children: initialPlayers, childrenType: 'Player'}]

const TeamAssignmentPanel: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(initalTeams);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  useEffect(() => {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    } else {
      setPlayers(initialPlayers);
    }
  }, []);

  const confirmTeams = () => {
    // 参加回数を増やし、ローカルストレージに保存
  };

  const TeamCard = ({team}: {team: Team}) => {
    const [teamCount, setTeamCount] = useState<number>(2);

    const assignTeams = (t: Team) => {
        if (team.childrenType === 'Team') {
          return;
        }
        const shuffledPlayers = [...t.children as Player[]].sort(() => Math.random() - 0.5);
        const newTeams: Team[] = Array.from({ length: teamCount }, (_, index) => ({ id: index + 1, children: [] as Player[], childrenType: 'Player' }));
    
        shuffledPlayers.forEach((player, index) => {
          (newTeams[index % teamCount].children as Player[]).push(player);
        });
        t.children = newTeams;
        t.childrenType = 'Team';
        setTeams([...teams]);
      };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Team {team.id}
                </Typography>
                {
                    team.children.map((subTeam: Team | Player, index: number) => 
                    team.childrenType === 'Team'
                        ? (
                            <Stack direction="column">
                                <TeamCard team={subTeam as Team} />
                            </Stack>
                        ) : (
                            <Stack key={(subTeam as Player).id} spacing={2}>
                                <Typography>{(subTeam as Player).name}</Typography>
                            </Stack>
                        )
                )}
            </CardContent>
            <CardActions>
                <TextField
                    label="チーム数"
                    type="number"
                    value={teamCount}
                    onChange={(e) => setTeamCount(parseInt(e.target.value))}
                />
                <Button variant="contained" color="primary" onClick={() => assignTeams(team)}>
                    チーム分け
            </Button>
            </CardActions>
        </Card>
    );
    }

  return (
    <>
      <Stack direction="column" useFlexGap flexWrap="wrap">
        {teams.map((team) => <TeamCard team={team} />)}
      </Stack>
      <Button variant="contained" color="secondary" onClick={confirmTeams}>
        確定
      </Button>
    </>
  );
};

export default TeamAssignmentPanel;