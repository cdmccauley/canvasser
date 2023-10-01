import { signIn } from "next-auth/react";

import { Button } from "@mui/material";

export default function SignedOut() {
  return (
    <div>
      <Button
        color="inherit"
        variant="outlined"
        onClick={() => signIn("Canvas")}
      >
        Sign In
      </Button>
    </div>
  );
}
