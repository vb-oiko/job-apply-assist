import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import {
  PositionType,
  PositionUpdateObject,
  Question,
} from "../../../server/constants/types";
import { QuestionList } from "./QuestionList";

export type PositionFormData = {
  url?: string;
  description?: string;
  title?: string;
  company?: string;
  reasons?: string;
  matchingPoints?: string;
  objective?: string;
  city?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  questions?: Question[];
};

const parseInitialValues = (initialValues?: PositionFormData) => ({
  url: initialValues?.url || "",
  description: initialValues?.description || "",
  title: initialValues?.title || "",
  company: initialValues?.company || "",
  reasons: initialValues?.reasons || "",
  matchingPoints: initialValues?.matchingPoints || "",
  objective: initialValues?.objective || "",
  city: initialValues?.city || "",
  resumeUrl: initialValues?.resumeUrl || "",
  coverLetterUrl: initialValues?.coverLetterUrl || "",
  questions: initialValues?.questions || [],
});

export interface PositionFormProps {
  onSubmit: (position: PositionUpdateObject) => void;
  onParse?: () => void;
  onGenerateDocs?: () => void;
  initialValues?: PositionFormData;
  type: PositionType;
  disabled?: boolean;
}

export const PositionForm: React.FC<PositionFormProps> = ({
  onSubmit,
  initialValues,
  onParse,
  onGenerateDocs,
  type,
  disabled = false,
}) => {
  const [formData, setFormData] = React.useState<PositionFormData>(
    parseInitialValues(initialValues)
  );

  React.useEffect(() => {
    setFormData(parseInitialValues(initialValues));
  }, [initialValues]);

  const handleSubmit = () => {
    const questions = formData.questions
      ? formData.questions.filter((question) => Boolean(question.question))
      : [];

    const validationResult = PositionUpdateObject.safeParse({
      ...formData,
      questions,
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

  const handleQuestionsChange = (questions: Question[]) => {
    setFormData((data) => ({ ...data, questions }));
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
        disabled={disabled}
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
        disabled={disabled}
      />

      <Box mb={2}></Box>

      <QuestionList
        onChange={handleQuestionsChange}
        questions={formData.questions}
        disabled={disabled}
      />
      {initialValues && onParse ? (
        <>
          <Box mb={2}></Box>

          <Button
            onClick={onParse}
            variant="outlined"
            disabled={!formData.url || !formData.description || disabled}
          >
            Parse
          </Button>
        </>
      ) : null}

      {type === "parsed" || type === "generated" ? (
        <>
          <Box mb={2}></Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                required
                id="title"
                name="title"
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="company"
                name="company"
                label="Company"
                fullWidth
                value={formData.company}
                onChange={handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="city"
                name="city"
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                disabled={disabled}
              />
            </Grid>
          </Grid>

          <Box mb={2}></Box>

          <TextField
            required
            id="reasons"
            name="reasons"
            label="Reasons to join the company"
            multiline
            rows={3}
            fullWidth
            value={formData.reasons}
            onChange={handleChange}
            disabled={disabled}
          />

          <Box mb={2}></Box>

          <TextField
            required
            id="matchingPoints"
            name="matchingPoints"
            label="Matching points"
            multiline
            rows={8}
            fullWidth
            value={formData.matchingPoints}
            onChange={handleChange}
            disabled={disabled}
          />

          <Box mb={2}></Box>

          <TextField
            required
            id="objective"
            name="objective"
            label="Objective"
            multiline
            rows={3}
            fullWidth
            value={formData.objective}
            onChange={handleChange}
            disabled={disabled}
          />

          <Box mb={2}></Box>

          <Button
            onClick={onGenerateDocs}
            variant="outlined"
            disabled={!formData.url || !formData.description || disabled}
          >
            Generate docs
          </Button>
        </>
      ) : null}

      {type === "generated" ? (
        <>
          <Box mb={2}></Box>
          <a
            href={formData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <Box mb={2}></Box>
          <a
            href={formData.coverLetterUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cover letter
          </a>
        </>
      ) : null}

      <Box mb={2}></Box>

      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!formData.url || !formData.description || disabled}
      >
        Save
      </Button>
    </>
  );
};
