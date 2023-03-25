import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PositionList } from "../components/PositionList";

export const Positions = () => (
  <>
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      component={RouterLink}
      to="/positions/create"
    >
      Add Position
    </Button>
    <Box mb={2}></Box>
    <PositionList />
  </>
);
