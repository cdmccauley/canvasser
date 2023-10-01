"use-client";

import { signOut } from "next-auth/react";

import { Button } from "@mui/material";

export default function SignedIn() {
  return (
    <div>
      <Button
        color="inherit"
        variant="outlined"
        onClick={() => signOut("Canvas")}
      >
        Sign Out
      </Button>
    </div>
  );
}
