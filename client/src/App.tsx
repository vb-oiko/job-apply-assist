import { Button, Link as MuiLink, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { Positions } from "./views/Positions";
import { Routes, Route, Outlet, Link as RouterLink } from "react-router-dom";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:2022",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Positions />} />
            <Route path="positions" element={<Positions />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const Layout = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ height: "100vh" }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit" component="div">
                Job Apply Assist
              </Typography>

              <Box ml={4}></Box>

              <Stack direction="row" spacing={2}>
                <Button
                  color="inherit"
                  variant="text"
                  component={RouterLink}
                  to="/"
                >
                  Positions
                </Button>
              </Stack>
            </Toolbar>
          </AppBar>

          <Outlet />
        </Box>
      </Container>
    </>
  );
};

const NoMatch = () => <div>Page not found</div>;
