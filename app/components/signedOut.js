import { signIn } from "next-auth/react";

export default function SignedOut() {
  return <button onClick={() => signIn("Canvas")}>Sign in</button>;
}
