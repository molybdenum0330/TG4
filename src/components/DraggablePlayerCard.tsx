import { useDrag } from "react-dnd";
import { PlayerDropItem, DroppableTypes } from "../types/types";
import PlayerCard from "./PlayerCard";

const DraggablePlayerCard = ({ player, dropCallback }: PlayerDropItem) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DroppableTypes.PLAYER,
    item: { player, dropCallback },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} >
      <PlayerCard player={player} />
    </div>
  );
}

export default DraggablePlayerCard;
