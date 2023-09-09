import React from "react";
import { trpc } from "../../utils/trpc";
import { setToken } from "../../App";
import { UserCredentials } from "../../../../server/constants/types";

export interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (credentials: UserCredentials, callback?: VoidFunction) => void;
  signOut: (callback?: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const loginMutation = trpc.login.useMutation();

  const signIn = (credentials: UserCredentials, callback?: VoidFunction) => {
    loginMutation.mutate(credentials, {
      onSuccess(data) {
        setToken(data.access_token);
        setIsAuthenticated(true);
        if (callback) {
          callback();
        }
      },
    });
  };

  const signOut = (callback?: VoidFunction) => {
    setIsAuthenticated(false);
    if (callback) {
      callback();
    }
  };

  const value = { isAuthenticated, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
