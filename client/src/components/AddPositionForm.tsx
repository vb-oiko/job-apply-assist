import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import React from "react";
import { PositionInsertObject } from "../../../server/controller/PositionController";

export interface AddPositionFormProps {
  onCancel: () => void;
  onSubmit: (position: PositionInsertObject) => void;
}

export const AddPositionForm: React.FC<AddPositionFormProps> = ({
  onCancel,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<PositionInsertObject>({
    url: "",
    description: "",
  });

  const handleClose = () => {
    onCancel();
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (ev) => {
    setFormData((data) => ({ ...data, [ev.target.name]: ev.target.value }));
  };

  return (
    <>
      <DialogContent>
        <TextField
          required
          autoFocus
          margin="dense"
          id="url"
          name="url"
          label="URL"
          type="text"
          fullWidth
          variant="outlined"
          onChange={handleChange}
        />

        <Box mb={1}></Box>

        <TextField
          required
          id="description"
          name="description"
          label="Description"
          multiline
          rows={10}
          fullWidth
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="outlined"
          disabled={!formData.url || !formData.description}
        >
          Add position
        </Button>
      </DialogActions>
    </>
  );
};
