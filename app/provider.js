"use client";

import { SessionProvider } from "next-auth/react";

export default function Provider({ children }) {
  // for nextauth sessions on client
  return <SessionProvider>{children}</SessionProvider>;
}
