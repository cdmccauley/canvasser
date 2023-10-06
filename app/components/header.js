import { useContext } from "react";

import { useSession, signIn, signOut } from "next-auth/react";

import { ThemeContext } from "../provider";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import SailingRoundedIcon from "@mui/icons-material/SailingRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRounded from "@mui/icons-material/DarkModeRounded";

import Notify from "./notify";
import Courses from "./courses";

// TODO: move mode button into a component similar to notify
export default function Header() {
  const { status } = useSession();

  const theme = useContext(ThemeContext);

  return (
    <AppBar position="static">
      <Toolbar disableGutters sx={{ pt: 1, pb: 1, pl: 2, pr: 2 }}>
        <SailingRoundedIcon sx={{ mr: 1.5 }} />

        <Typography variant="h6" noWrap sx={{ mr: 1, flexGrow: 1 }}>
          Canvasser
        </Typography>

        {status === "authenticated" ? (
          <>
            <Notify />
            <Courses />
          </>
        ) : undefined}

        {status && status !== "loading" ? (
          <IconButton sx={{ mr: 2 }} onClick={() => theme.switch()}>
            {theme.name == "light" ? (
              <DarkModeRounded sx={{ color: "#FFF" }} />
            ) : (
              <LightModeRoundedIcon />
            )}
          </IconButton>
        ) : undefined}

        {status === "unauthenticated" ? (
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => signIn("Canvas")}
          >
            Sign In
          </Button>
        ) : status === "authenticated" ? (
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => signOut("Canvas")}
          >
            Sign Out
          </Button>
        ) : undefined}
      </Toolbar>
    </AppBar>
  );
}
