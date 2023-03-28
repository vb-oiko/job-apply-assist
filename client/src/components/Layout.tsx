import { Button, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Outlet } from "react-router-dom";

export const Layout = () => {
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

          <Box py={2}>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </>
  );
};
