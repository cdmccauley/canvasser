import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

export default function Token() {
  const url = "/api/token";

  const router = useRouter();

  // TODO: rearrange, error last, make error true if no code or state or just redirect
  const error = router.query.error;
  const code = router.query.code;
  const state = router.query.state;

  const success = !error && code && state;

  if (success) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return new Promise((res, rej) => {
          if (data) {
            // TODO: see if this time conversion thing can be cleaned up
            const token = {...data, expires_at: (new Date().getTime() / 1000 + data.expires_in) * 1000}
            localStorage.setItem("token", JSON.stringify(token));
            res();
          } else {
            rej("token storage failed");
          }
        });
      })
      .then(() => router.push("/"))
      .catch((error) => console.error("error: ", error));
  }

  return (
    <div>
      <Head>
        <title>Canvasser - Token</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{error ? "Error" : "Success"}</main>

      <style jsx global>{`
        html,
        body {
          background: #222;
          color: #fff;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
