import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { PositionList } from "../components/PositionList";

export const Positions = () => (
  <Box py={2}>
    <Button variant="outlined" startIcon={<AddIcon />}>
      Add position
    </Button>

    <Box mb={2}></Box>

    <PositionList />
  </Box>
);
