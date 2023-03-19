import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { PromptInsertObject } from "../../../server/constants/types";
import { trpc } from "../utils/trpc";
import { AddPromptForm } from "./AddPromptForm";

export const AddPromptButton = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const utils = trpc.useContext();
  const createReport = trpc.createPrompt.useMutation({
    onSuccess: () => {
      utils.listPrompts.invalidate();
    },
  });

  const handleSubmit = (prompt: PromptInsertObject) => {
    createReport.mutate(prompt);
    setOpen(false);
  };

  const { data: promptTypes } = trpc.getPromptTypes.useQuery();

  if (!promptTypes) {
    return (
      <Button variant="outlined" startIcon={<AddIcon />} disabled>
        Add position
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        disabled={!promptTypes}
      >
        Add prompt
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add new position</DialogTitle>
        <AddPromptForm
          onCancel={handleClose}
          onSubmit={handleSubmit}
          promptTypes={promptTypes.promptTypes}
        />
      </Dialog>
    </>
  );
};
