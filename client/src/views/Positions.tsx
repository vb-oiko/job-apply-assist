import { Box } from "@mui/material";
import { PositionList } from "../components/PositionList";
import { AddPositionButton } from "../components/AddPositionButton";

export const Positions = () => (
  <Box py={2}>
    <AddPositionButton />
    <Box mb={2}></Box>
    <PositionList />
  </Box>
);
