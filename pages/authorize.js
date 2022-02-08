import React from "react";

import Head from "next/head";

export default function Authorize() {
  // TODO: implement state parameter in URL
  const subdomain = "davistech";
  const client_id = "140000000000311";
  const state = "temp";
  const redirect_uri = "https://canvasser.vercel.app";
  const url = `https://${subdomain}.instructure.com/login/oauth2/auth?client_id=${client_id}&response_type=code&state=${state}&redirect_uri=${redirect_uri}`;

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
        <a href={url}>Authorize</a>
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
