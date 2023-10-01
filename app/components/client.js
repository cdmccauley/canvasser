"use client";

import { useSession } from "next-auth/react";

import Loading from "./loading";
import Default from "./default";
import Header from "./header";
import Interface from "./interface";

export default function Client() {
  const { status } = useSession();

  return status === "loading" ? (
    <Loading />
  ) : status === "unauthenticated" ? (
    <Header />
  ) : status === "authenticated" ? (
    <>
      <Header />
      <Interface />
    </>
  ) : (
    <Default />
  );
}
