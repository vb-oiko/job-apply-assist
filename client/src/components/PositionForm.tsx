import { Grid } from "@mui/material";
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
  title?: string;
  company?: string;
  reasons?: string;
  matchingPoints?: string;
};

const parseInitialValues = (initialValues?: PositionFormData) => ({
  url: initialValues?.url || "",
  description: initialValues?.description || "",
  title: initialValues?.title || "",
  company: initialValues?.company || "",
  reasons: initialValues?.reasons || "",
  matchingPoints: initialValues?.matchingPoints || "",
});

export interface PositionFormProps {
  onSubmit: (position: PositionUpdateObject) => void;
  onRegenerate?: () => void;
  initialValues?: PositionFormData;
  type: PositionType;
}

export const PositionForm: React.FC<PositionFormProps> = ({
  onSubmit,
  initialValues,
  onRegenerate,
  type,
}) => {
  const [formData, setFormData] = React.useState<PositionFormData>(
    parseInitialValues(initialValues)
  );

  React.useEffect(() => {
    setFormData(parseInitialValues(initialValues));
  }, [initialValues]);

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

      <Box mb={2}></Box>

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

      {initialValues && onRegenerate ? (
        <>
          <Box mb={2}></Box>

          <Button
            onClick={onRegenerate}
            variant="outlined"
            disabled={!formData.url || !formData.description}
          >
            Regenerate
          </Button>
        </>
      ) : null}

      {type === "parsed" || type === "generated" ? (
        <>
          <Box mb={2}></Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                id="title"
                name="title"
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="company"
                name="company"
                label="Company"
                fullWidth
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </>
      ) : null}

      <Box mb={2}></Box>

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
