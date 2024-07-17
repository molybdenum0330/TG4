import { useDrag } from "react-dnd";
import { PlayerDropItem, DroppableTypes } from "../types/types";
import PlayerCard from "./PlayerCard";
import { Box } from "@mui/material";

const DraggablePlayerCard = ({ dndId, player, dropCallback }: PlayerDropItem) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: `${DroppableTypes.PLAYER}-${dndId}`,
    item: { player, dropCallback },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Box ref={drag} 
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab', // ホバー時のカーソル
        '&:hover': {
          cursor: 'pointer', // ホバー時のカーソル
        },
        '&:active': {
          cursor: 'grabbing', // ドラッグ時のカーソル
        }, 
      }}
    >
      <PlayerCard player={player} />
    </Box>
  );
}

export default DraggablePlayerCard;
