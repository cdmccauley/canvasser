"use-client";

import { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";

import Interface from "./interface";

export default function SignedIn() {
  const { data: session, status } = useSession();

  const [avatar, setAvatar] = useState();

  useEffect(() => {
    if (!avatar && session?.user?.avatar_url)
      setAvatar(session?.user?.avatar_url);
  }, [session]);

  return (
    <div>
      {avatar ? (
        <img
          src={avatar}
          style={{ borderRadius: "50%", border: "3px solid #333" }}
        />
      ) : undefined}
      <button onClick={() => signOut()}>Sign out</button>
      <Interface />
    </div>
  );
}
