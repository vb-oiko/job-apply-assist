import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React from "react";
import {
  PromptInsertObject,
  PromptType,
} from "../../../server/constants/types";

export interface PromptFormProps {
  promptTypes: PromptType[];
  onSubmit: (prompt: PromptInsertObject) => void;
  values?: Partial<PromptInsertObject>;
}

export const PromptForm: React.FC<PromptFormProps> = ({
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
      <Box maxWidth="20rem" mb={1}>
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
      </Box>

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

      <Box mb={1}></Box>

      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!formData.type || !formData.prompt}
      >
        Save
      </Button>
    </>
  );
};
