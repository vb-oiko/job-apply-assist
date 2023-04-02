import { Box, Button, IconButton, TextField } from "@mui/material";
import { nanoid } from "nanoid";
import React from "react";
import { Question } from "../../../server/constants/types";
import DeleteIcon from "@mui/icons-material/Delete";

export interface QuestionListProps {
  questions?: Question[];
  disabled?: boolean;
  onChange: (questions: Question[]) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  disabled = false,
  onChange,
}) => {
  const handleAddQuestion = React.useCallback(() => {
    onChange([...(questions ? questions : []), { id: nanoid(), question: "" }]);
  }, [questions, onChange]);

  const handleChange = React.useCallback(
    (id: string) =>
      (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = ev.target;
        const newQuestions = (questions ? questions : []).map((question) => {
          if (question.id === id) {
            return {
              ...question,
              [name]: value,
            };
          }
          return question;
        });
        onChange(newQuestions);
      },
    [questions, onChange]
  );

  const handleDelete = React.useCallback(
    (id: string) => () => {
      const newQuestions = (questions ? questions : []).filter(
        (question) => question.id !== id
      );
      onChange(newQuestions);
    },
    [questions, onChange]
  );

  return (
    <Box>
      <Button onClick={handleAddQuestion} variant="outlined">
        Add question
      </Button>
      <Box mb={2}></Box>

      {(questions ? questions : []).map((question) => (
        <Box key={question.id}>
          <Box mb={2} display="flex">
            <TextField
              required
              id="question"
              name="question"
              label="Question"
              fullWidth
              value={question.question}
              onChange={handleChange(question.id)}
              disabled={disabled}
            />

            <Box ml={1}>
              <IconButton
                aria-label="delete"
                size="large"
                onClick={handleDelete(question.id)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>

          {question.answer ? (
            <>
              <Box mb={2}></Box>

              <TextField
                required
                id="answer"
                name="answer"
                label="Answer"
                fullWidth
                value={question.answer}
                disabled={disabled}
                rows={3}
                onChange={handleChange(question.id)}
              />
            </>
          ) : null}
        </Box>
      ))}
    </Box>
  );
};
