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
import { Home } from "./views/Home";
import { AUTH_TOKEN_KEY } from "./constants/constants";
import { ROUTES } from "./navigation/routes";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://api.job-apply.vboiko.me"
    : "http://localhost:2022";

let accessToken: string | null = localStorage.getItem(AUTH_TOKEN_KEY);

export const setToken = (value: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, value);
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
            <Route path={ROUTES.HOME} element={<Layout />}>
              <Route index element={<Home />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path="*" element={<NoMatch />} />
            </Route>

            <Route
              path={ROUTES.HOME}
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path={ROUTES.POSITIONS.LIST} element={<Positions />} />
              <Route
                path={ROUTES.POSITIONS.CREATE}
                element={<PositionCreate />}
              />
              <Route
                path={ROUTES.POSITIONS.EDIT(":id")}
                element={<PositionEdit />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
