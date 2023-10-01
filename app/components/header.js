import { useSession, signIn, signOut } from "next-auth/react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Header() {
  const { status } = useSession();

  return (
    <AppBar position="static">
      <Toolbar disableGutters sx={{ pt: 1, pb: 1, pl: 2, pr: 2 }}>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Canvasser
        </Typography>
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
