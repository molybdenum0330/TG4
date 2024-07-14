import { Card, Typography } from "@mui/material";
import type { Player } from "../types/types";

const PlayerCard = ({ player }: { player: Player }) => (
  <Card sx={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography>{player.name}</Typography>
  </Card>
);

export default PlayerCard;