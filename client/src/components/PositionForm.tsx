import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import {
  PositionType,
  PositionUpdateObject,
} from "../../../server/constants/types";

export type PositionFormData = {
  url?: string;
  description?: string;
  position?: string;
  company?: string;
  reasons?: string;
  matchingPoints?: string;
};

export interface PositionFormProps {
  onSubmit: (position: PositionUpdateObject) => void;
  initialValues?: PositionFormData;
  type: PositionType;
}

export const PositionForm: React.FC<PositionFormProps> = ({
  onSubmit,
  initialValues,
  type,
}) => {
  const [formData, setFormData] = React.useState<PositionFormData>({
    url: initialValues?.url || "",
    description: initialValues?.description || "",
    position: initialValues?.position || "",
    company: initialValues?.company || "",
    reasons: initialValues?.reasons || "",
    matchingPoints: initialValues?.matchingPoints || "",
  });

  const handleSubmit = () => {
    const validationResult = PositionUpdateObject.safeParse({
      ...formData,
      type,
    });

    if (!validationResult.success) {
      return;
    }

    onSubmit(validationResult.data);
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
        value={formData.url}
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
        value={formData.description}
        onChange={handleChange}
      />

      {type === "parsed" || type === "generated" ? (
        <>
          <TextField
            required
            id="position"
            name="position"
            label="Position"
            fullWidth
            onChange={handleChange}
          />
        </>
      ) : null}

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
