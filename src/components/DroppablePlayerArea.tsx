import { useDrop } from "react-dnd";
import { Player, DroppableTypes } from "../types/types";
import { Box, useTheme } from "@mui/material";

export const DroppablePlayerArea = ({ children, onDrop }: { children: React.ReactNode; onDrop: (player: Player) => void }) => {
  const theme = useTheme();

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: DroppableTypes.PLAYER,
    canDrop: () => true,
    drop: (item: { player: Player, dropCallback: (player: Player) => void }) => {
      item.dropCallback(item.player);
      onDrop(item.player);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const getBackground = () => {
    if (isOver && canDrop) {
      return `repeating-linear-gradient(
        45deg,
        ${theme.palette.primary.light}10,
        ${theme.palette.primary.light}10 10px,
        ${theme.palette.primary.main}10 10px,
        ${theme.palette.primary.main}10 20px
      )`; // ドロップ可能かつホバー中の縞々の色
    } else if (canDrop) {
      return `repeating-linear-gradient(
        45deg,
        ${theme.palette.secondary.light}10,
        ${theme.palette.secondary.light}10 10px,
        ${theme.palette.secondary.main}10 10px,
        ${theme.palette.secondary.main}10 20px
      )`; // ドロップ可能なエリアの縞々の色
    } else {
      return theme.palette.background.default; // 通常の色
    }
  };

  return (
    <Box
      ref={drop}
      sx={{
        background: getBackground(),
        padding: '16px',
        flexGrow: 1, // 親のflexコンテナ内でエリアいっぱいに広げる
        boxSizing: 'border-box', // paddingを含めてサイズを計算
      }}
    >
      {children}
    </Box>
  );
};

export default DroppablePlayerArea;
