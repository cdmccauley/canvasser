import React, { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

export default function Extract() {
  const router = useRouter();

  const error = router.query.error;
  const code = router.query.code;
  const state = router.query.state;

  const url = "/api/token";

  if (code && state) {
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
      .then((data) => console.log(data))
      .catch((error) => console.log("error: ", error));
  }

  return (
    <div>
      <Head>
        <title>Canvasser - Extract</title>
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
