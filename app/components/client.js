"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import Loading from "./loading";
import SignedOut from "./signedOut";
import SignedIn from "./signedIn";
import Default from "./default";

export default function Client() {
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   console.log("loaded");
  // }, []);

  // useEffect(() => {
  //   if (session) console.log("session", session);
  // }, [session]);

  // useEffect(() => {
  //   if (status) console.log("status", status);
  // }, [status]);

  return (
    <div>
      {status === "loading" ? (
        <Loading />
      ) : status === "unauthenticated" ? (
        <SignedOut />
      ) : status === "authenticated" ? (
        <SignedIn />
      ) : (
        <Default />
      )}
    </div>
  );
}
