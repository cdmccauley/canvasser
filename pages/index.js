import Head from "next/head";
import React, { useState, useEffect, useMemo } from "react";

export default function Index() {
  // TODO: implement state parameter in URL
  const url =
    "https://davistech.instructure.com/login/oauth2/auth?client_id=140000000000311&response_type=code&state=temp&redirect_uri=https://canvasser.vercel.app"; // TODO: update to /token

  // const [darkMode, setDarkMode] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    if (!token && localStorage.getItem("token"))
      setToken(JSON.parse(localStorage.getItem("token")));
  }, []);

  useMemo(() => {
    if (token) setAuthorized(true);
  }, [token]);

  // if (token) console.log(token, authorized);

  return (
    <div>
      <Head>
        <title>Canvasser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {authorized ? `Welcome ${token.user.name}` : null}
        <a href={url}>Authorize</a>
      </main>

      <style jsx global>{`
        html,
        body {
          color: #fff;
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
