import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NoMatch } from "./components/NoMatch";
import { trpc } from "./utils/trpc";
import { PositionCreate } from "./views/PositionCreate";
import { PositionEdit } from "./views/PositionEdit";
import { Positions } from "./views/Positions";
import { Login } from "./views/Login/Login";
import { AuthProvider } from "./components/auth/AuthProvider";
import { RequireAuth } from "./components/auth/RequireAuth";
import { Signup } from "./views/Login/Signup";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://api.job-apply.vboiko.me"
    : "http://localhost:2022";

let accessToken: string | undefined;

export const setToken = (value: string) => {
  accessToken = value;
};

export function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: API_BASE_URL,
          headers: () => {
            return accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Positions />} />
              <Route path="positions" element={<Positions />} />
              <Route path="positions/create" element={<PositionCreate />} />
              <Route path="positions/:id" element={<PositionEdit />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
