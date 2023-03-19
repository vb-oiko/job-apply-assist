import { Box } from "@mui/material";
import { AddPromptButton } from "../components/AddPromptButton";
import { PromptList } from "../components/PromptList";

export const Prompts = () => (
  <Box py={2}>
    <AddPromptButton />
    <Box mb={2}></Box>
    <PromptList />
  </Box>
);
