import { Box, Button, IconButton, TextField } from "@mui/material";
import { nanoid } from "nanoid";
import React from "react";
import { Question } from "../../../server/constants/types";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export interface QuestionListProps {
  questions?: Question[];
  disabled?: boolean;
  onChange: (questions: Question[]) => void;
  onGenerateAnswer?: (questionId: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  disabled = false,
  onChange,
  onGenerateAnswer,
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

  const handleGenerateAnswer = React.useCallback(
    (questionId: string) => () => {
      onGenerateAnswer && onGenerateAnswer(questionId);
    },
    [onGenerateAnswer]
  );

  return (
    <Box>
      <Button onClick={handleAddQuestion} variant="outlined">
        Add question
      </Button>
      <Box mb={2}></Box>

      {(questions ? questions : []).map((question) => (
        <Box key={question.id} mb={2}>
          <Box display="flex">
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
                title="Generate answer"
                aria-label="generate answer"
                size="large"
                onClick={handleGenerateAnswer(question.id)}
                disabled={!question.question || disabled}
              >
                <QuestionAnswerIcon fontSize="inherit" />
              </IconButton>
            </Box>

            <Box ml={1}>
              <IconButton
                title="Delete question"
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
              <Box mt={2} ml={2}>
                <TextField
                  required
                  id="answer"
                  name="answer"
                  label="Answer"
                  fullWidth
                  value={question.answer}
                  disabled={disabled}
                  multiline
                  rows={10}
                  onChange={handleChange(question.id)}
                />
              </Box>
            </>
          ) : null}
        </Box>
      ))}
    </Box>
  );
};
