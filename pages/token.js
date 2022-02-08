import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

export default function Token() {
  const url = "/api/token";

  const router = useRouter();

  const code = router.query.code;
  const state = router.query.state;
  const error = !code || !state || router.query.error;

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
      .then((res) => {
        if (!res.ok) {
          const ex = new Error("token request failed");
          ex.info = res.json();
          ex.status = res.status;
          throw ex;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
        return new Promise((res, rej) => {
          if (data) {
            // TODO: see if this time conversion thing can be cleaned up
            const token = {
              ...data,
              expires_at:
                (new Date().getTime() / 1000 + data.expires_in) * 1000,
            };
            localStorage.setItem("token", JSON.stringify(token));
            res();
          } else {
            rej();
          }
        });
      })
      .then(() => router.push("/"))
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <Head>
        <title>Canvasser - Token</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <main>
        {error ? "Error: Unable To Request Token" : "Requesting Token"}
      </main>

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
