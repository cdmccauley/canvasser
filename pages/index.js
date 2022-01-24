import Head from "next/head";
import React, { useState, useEffect, useMemo } from "react";

export default function Index() {
  // TODO: implement state parameter in URL
  const subdomain = "davistech"
  const client_id = "140000000000311"
  const state = "temp"
  // const redirect_uri = "https://canvasser.vercel.app"
  const redirect_uri = "https://canvasser-git-03-ncode.vercel.app/token"
  const url =
    `https://${subdomain}.instructure.com/login/oauth2/auth?client_id=${client_id}&response_type=code&state=${state}&redirect_uri=${redirect_uri}`;

  // const [darkMode, setDarkMode] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA)
    if (!token && localStorage.getItem("token"))
      setToken(JSON.parse(localStorage.getItem("token")));
  }, []);

  useMemo(() => {
    if (token) setAuthorized(true);
  }, [token]);

  if (authorized)
    fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: token.access_token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // array of courses
        // console.log(data.data.allCourses);

        // course submissions array
        // console.log(data.data.allCourses[].submissionsConnection.edges);
        
        // course id
        // console.log(data.data.allCourses[37]._id)

        // submission id
        // console.log(data.data.allCourses[37].submissionsConnection.edges[0].node.assignment._id)
        
        // assignment id
        // console.log(data.data.allCourses[37].submissionsConnection.edges[0].node.user._id)
        
        // speedgrader url
        // console.log(`https://${subdomain}.instructure.com/courses/${data.data.allCourses[37]._id}/gradebook/speed_grader?assignment_id=${data.data.allCourses[37].submissionsConnection.edges[0].node.assignment._id}&student_id=${data.data.allCourses[37].submissionsConnection.edges[0].node.user._id}`)
        
        // grades url
        // console.log(`https://${subdomain}.instructure.com/courses/${data.data.allCourses[37]._id}/grades/${data.data.allCourses[37].submissionsConnection.edges[0].node.user._id}`)
      });

  return (
    <div>
      <Head>
        <title>Canvasser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {authorized ? `Welcome ${token.user.name}` : null}
        <br />
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
