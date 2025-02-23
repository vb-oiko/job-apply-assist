import { Button, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import React from "react";
import { useNavigation } from "../navigation/useNavigation";
import { ROUTES } from "../navigation/routes";

export const Layout = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigation = useNavigation();

  const handleLogout = React.useCallback(() => {
    signOut(() => navigation.toHome());
  }, [signOut, navigation]);

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
                {isAuthenticated ? (
                  <>
                    <Button
                      color="inherit"
                      variant="text"
                      component={RouterLink}
                      to={ROUTES.POSITIONS.LIST}
                    >
                      Positions
                    </Button>
                    <Button
                      color="inherit"
                      variant="text"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    color="inherit"
                    variant="text"
                    component={RouterLink}
                    to={ROUTES.LOGIN}
                  >
                    Login
                  </Button>
                )}
              </Stack>
            </Toolbar>
          </AppBar>

          <Box py={2}>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </>
  );
};
