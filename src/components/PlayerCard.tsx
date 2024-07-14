import { Card, Typography } from "@mui/material";
import type { Player } from "../types/types";
import React from "react";

const PlayerCard = ({ player }: { player: Player }) => (
  <Card
  sx={{
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab', // ホバー時のカーソル
    '&:hover': {
      cursor: 'pointer', // ホバー時のカーソル
    },
    '&:active': {
      cursor: 'grabbing', // ドラッグ時のカーソル
    }, 
  }}>
    <Typography>{player.name}</Typography>
  </Card>
);

export default PlayerCard;