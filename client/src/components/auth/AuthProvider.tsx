import React from "react";
import { trpc } from "../../utils/trpc";
import { setToken } from "../../App";

export interface AuthContextType {
  user: any;
  signIn: (user: string, callback?: VoidFunction) => void;
  signOut: (callback?: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loginMutation = trpc.login.useMutation({
    onSuccess(data) {
      setToken(data.access_token);
    },
  });

  const [user, setUser] = React.useState<any>(null);

  const signIn = (newUser: string, callback?: VoidFunction) => {
    loginMutation.mutate({});
    setUser(newUser);
    if (callback) {
      callback();
    }
  };

  const signOut = (callback?: VoidFunction) => {
    setUser(null);
    if (callback) {
      callback();
    }
  };

  const value = { user, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}