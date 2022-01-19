import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function Index() {
  // TODO: implement state parameter in URL
  const url =
    "https://davistech.instructure.com/login/oauth2/auth?client_id=140000000000311&response_type=code&state=temp&redirect_uri=https://canvasser.vercel.app"; // TODO: update to /extract

  return (
    <div className="container">
      <Head>
        <title>Canvasser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <a href={url}>Login</a>
      </main>

      <style jsx global>{`
        html,
        body {
          background: #222;
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
