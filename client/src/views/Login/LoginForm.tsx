import { Box, Button, TextField } from "@mui/material";
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
    <>
      <TextField
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

      <Button onClick={handleSubmit}>{buttonText}</Button>
    </>
  );
};
