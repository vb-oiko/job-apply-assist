import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginForm, LoginFormData } from "./LoginForm";

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = React.useCallback((data: LoginFormData) => {
    auth.signIn(data, () => {
      navigate(from, { replace: true });
    });
  }, []);

  return <LoginForm onSubmit={handleSubmit} />;
};
