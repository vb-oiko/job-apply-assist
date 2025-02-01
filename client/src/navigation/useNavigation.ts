import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createNavigation } from "./Navigation";

export const useNavigation = () => {
  const navigate = useNavigate();
  return useMemo(() => createNavigation(navigate), [navigate]);
};
