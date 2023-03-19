import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { RawPositionInsertObject } from "../../../server/constants/types";
import { trpc } from "../utils/trpc";
import { AddPositionForm } from "./AddPositionForm";

export const AddPositionButton = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const utils = trpc.useContext();
  const createReport = trpc.createPosition.useMutation({
    onSuccess: () => {
      utils.listPositions.invalidate();
    },
  });

  const handleSubmit = (position: RawPositionInsertObject) => {
    createReport.mutate(position);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        Add position
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add new position</DialogTitle>
        <AddPositionForm onCancel={handleClose} onSubmit={handleSubmit} />
      </Dialog>
    </>
  );
};
