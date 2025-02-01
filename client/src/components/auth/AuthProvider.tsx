import React from "react";
import { trpc } from "../../utils/trpc";
import { setToken } from "../../App";
import { UserCredentials } from "../../../../server/constants/types";
import { AUTH_TOKEN_KEY } from "../../constants/constants";

export interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (credentials: UserCredentials, callback?: VoidFunction) => void;
  signOut: (callback?: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    localStorage.getItem(AUTH_TOKEN_KEY) !== null
  );

  const loginMutation = trpc.login.useMutation();

  const signIn = React.useCallback(
    (credentials: UserCredentials, callback?: VoidFunction) => {
      loginMutation.mutate(credentials, {
        onSuccess(data) {
          setToken(data.access_token);
          setIsAuthenticated(true);
          if (callback) {
            callback();
          }
        },
      });
    },
    []
  );

  const signOut = React.useCallback((callback?: VoidFunction) => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
    if (callback) {
      callback();
    }
  }, []);

  const value = React.useMemo(
    () => ({ isAuthenticated, signIn, signOut }),
    [isAuthenticated, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
