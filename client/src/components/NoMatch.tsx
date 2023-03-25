import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import { Routes, Route, Outlet, Link as RouterLink } from "react-router-dom";

export const NoMatch = () => (
  <Box py={2} alignItems="center">
    <Typography align="center" variant="h3">
      Page not found
    </Typography>
    <Box display="flex" justifyContent="center" mt={2}>
      <Button color="inherit" variant="outlined" component={RouterLink} to="/">
        Return to home page
      </Button>
    </Box>
  </Box>
);
