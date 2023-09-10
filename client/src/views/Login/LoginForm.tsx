import { Box, Button, Card, Paper, TextField } from "@mui/material";
import React from "react";
import { z } from "zod";

export interface LoginFormProps {
  onSubmit: (formData: LoginFormData) => void;
  type?: "login" | "signup";
}

export const LoginFormData = z.object({
  login: z.string(),
  password: z.string(),
  repeatPassword: z.string().optional(),
});

export type LoginFormData = z.infer<typeof LoginFormData>;

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  type = "login",
}) => {
  const [formData, setFormData] = React.useState<Partial<LoginFormData>>({
    login: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (ev) => {
    setFormData((data) => ({ ...data, [ev.target.name]: ev.target.value }));
  };

  const handleSubmit = React.useCallback(() => {
    const validationResult = LoginFormData.safeParse(formData);

    if (!validationResult.success) {
      return;
    }

    const { data } = validationResult;

    if (type === "signup" && data.password !== data.repeatPassword) {
      return;
    }

    onSubmit(data);
  }, [formData]);

  const buttonText = React.useMemo(() => {
    if (type === "login") {
      return "Login";
    }

    if (type === "signup") {
      return "Sign Up";
    }

    return "Submit";
  }, [type]);

  return (
    <Box width="20rem" mx="auto" mt={20}>
      <Paper>
        <Box p={4}>
          <TextField
            fullWidth
            required
            autoFocus
            margin="dense"
            id="login"
            name="login"
            label="login"
            type="text"
            variant="outlined"
            value={formData.login}
            onChange={handleChange}
          />

          <Box mb={2}></Box>

          <TextField
            fullWidth
            required
            margin="dense"
            id="password"
            name="password"
            label="password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
          />

          <Box mb={2}></Box>

          {type === "signup" ? (
            <>
              <TextField
                fullWidth
                required
                margin="dense"
                id="repeatPassword"
                name="repeatPassword"
                label="repeat password"
                type="password"
                variant="outlined"
                value={formData.repeatPassword}
                onChange={handleChange}
              />

              <Box mb={2}></Box>
            </>
          ) : null}

          <Box mt={3} display="flex">
            <Box mt={3} ml="auto" />
            <Button onClick={handleSubmit} variant="outlined">
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
