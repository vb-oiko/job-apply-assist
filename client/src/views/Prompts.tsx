import { Box } from "@mui/material";
import { AddPromptButton } from "../components/AddPromptButton";
import { PromptList } from "../components/PromptList";

export const Prompts = () => (
  <>
    <AddPromptButton />
    <Box mb={2}></Box>
    <PromptList />
  </>
);
