import { Button } from "@mui/material";
import React from "react";
import { useAuth } from "../components/auth/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleClick = React.useCallback(() => {
    auth.signIn("user", () => {
      navigate(from, { replace: true });
    });
  }, []);

  return <Button onClick={handleClick}>Login</Button>;
};
