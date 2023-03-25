import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PromptList } from "../components/PromptList";

export const Prompts = () => (
  <>
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      component={RouterLink}
      to="/prompts/create"
    >
      Add Prompt
    </Button>
    <Box mb={2}></Box>
    <PromptList />
  </>
);
