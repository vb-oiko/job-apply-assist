import React from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { LoginForm, LoginFormData } from "./LoginForm";
import { trpc } from "../../utils/trpc";

export const Signup = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const signupMutation = trpc.signup.useMutation({
    onSuccess() {
      navigate("/login");
    },
  });

  const handleSubmit = React.useCallback((data: LoginFormData) => {
    const { login, password } = data;

    signupMutation.mutate({ login, password });
  }, []);

  return <LoginForm type="signup" onSubmit={handleSubmit} />;
};
