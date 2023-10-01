"use client";

import { useSession } from "next-auth/react";

import SignedOut from "./signedOut";
import SignedIn from "./signedIn";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Header() {
  const { status } = useSession();

  return (
    <AppBar position="static">
      <Toolbar disableGutters sx={{ pt: 1, pb: 1, pl: 2, pr: 2 }}>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Canvasser
        </Typography>
        {status === "unauthenticated" ? (
          <SignedOut />
        ) : status === "authenticated" ? (
          <SignedIn />
        ) : undefined}
      </Toolbar>
    </AppBar>
  );
}
