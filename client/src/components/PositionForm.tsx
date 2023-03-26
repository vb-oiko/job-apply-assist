import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import { RawPositionInsertObject } from "../../../server/constants/types";

export interface PositionFormProps {
  onSubmit: (position: RawPositionInsertObject) => void;
  initialValues?: RawPositionInsertObject;
}

export const PositionForm: React.FC<PositionFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [formData, setFormData] = React.useState<RawPositionInsertObject>({
    type: "raw",
    url: initialValues?.url || "",
    description: initialValues?.description || "",
  });

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

      <Box mb={1}></Box>

      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!formData.url || !formData.description}
      >
        Save
      </Button>
    </>
  );
};
