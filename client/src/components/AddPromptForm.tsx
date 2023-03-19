import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import React from "react";
import {
  PromptInsertObject,
  PromptType,
} from "../../../server/constants/types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export interface AddPromptFormProps {
  promptTypes: PromptType[];
  onCancel: () => void;
  onSubmit: (prompt: PromptInsertObject) => void;
  values?: Partial<PromptInsertObject>;
}

export const AddPromptForm: React.FC<AddPromptFormProps> = ({
  onCancel,
  onSubmit,
  promptTypes,
  values,
}) => {
  const [formData, setFormData] = React.useState<{
    type: PromptType | "";
    prompt: string;
  }>({
    type: values?.type || "",
    prompt: values?.prompt || "",
  });

  const handleClose = () => {
    onCancel();
  };

  const handleSubmit = () => {
    const { prompt, type } = formData;
    if (prompt && type) {
      onSubmit({ prompt, type });
    }
  };

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (ev) => {
    setFormData((data) => ({ ...data, [ev.target.name]: ev.target.value }));
  };

  const handleSelectChange = (ev: SelectChangeEvent<any>) => {
    setFormData((data) => ({ ...data, type: ev.target.value }));
  };

  return (
    <>
      <DialogContent>
        <Box mb={1}></Box>

        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={formData.type}
            label="Type"
            onChange={handleSelectChange}
          >
            {promptTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replaceAll("_", " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mb={1}></Box>

        <TextField
          required
          id="prompt"
          name="prompt"
          label="Prompt"
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
          disabled={!formData.type || !formData.prompt}
        >
          Add prompt
        </Button>
      </DialogActions>
    </>
  );
};
