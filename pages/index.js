import React, { useState, useEffect, useMemo, createContext } from "react";

export const DataContext = createContext({});

import { useRouter } from "next/router";
import Head from "next/head";

import useRefresh from "../data/use-refresh";
import useSubmissions from "../data/use-submissions";

import Authorize from "../components/authorize";

export default function Index() {
  // const [darkMode, setDarkMode] = useState(true);
  // const [authorized, setAuthorized] = useState(false);
  // const [refresh, setRefresh] = useState(undefined);

  const router = useRouter();

  const [token, setToken] = useState(undefined);

  useEffect(() => {
    const localToken = JSON.parse(localStorage.getItem("token"));
    if (!localToken) {
      router.push("/Authorize");
    } else {
      setToken(localToken);
    }
  }, []);

  const { accessToken, tokenLoading, tokenError } = useRefresh({ token });
  //   console.log("/components/data", accessToken, tokenLoading, tokenError);

  const { submissions, submissionsLoading, submissionsError } = useSubmissions({
    accessToken,
  });
  //   console.log("/components/data", submissions, submissionsLoading, submissionsError);

  // useEffect(() => {
  //   if (false)
  //     fetch("/api/submissions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         access_token: token.access_token,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         // array of courses
  //         console.log(data.data.allCourses);
  //         // course submissions array
  //         // console.log(data.data.allCourses[].submissionsConnection.edges);
  //         // course id
  //         // console.log(data.data.allCourses[37]._id)
  //         // submission id
  //         // console.log(data.data.allCourses[37].submissionsConnection.edges[0].node.assignment._id)
  //         // assignment id
  //         // console.log(data.data.allCourses[37].submissionsConnection.edges[0].node.user._id)
  //         // speedgrader url
  //         // console.log(`https://${subdomain}.instructure.com/courses/${data.data.allCourses[37]._id}/gradebook/speed_grader?assignment_id=${data.data.allCourses[37].submissionsConnection.edges[0].node.assignment._id}&student_id=${data.data.allCourses[37].submissionsConnection.edges[0].node.user._id}`)
  //         // grades url
  //         // console.log(`https://${subdomain}.instructure.com/courses/${data.data.allCourses[37]._id}/grades/${data.data.allCourses[37].submissionsConnection.edges[0].node.user._id}`)
  //       })
  //       .catch((error) => console.error(error));
  // }, [authorized]);

  return (
    <div>
      <Head>
        <title>Canvasser</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <DataContext.Provider value={{ accessToken, submissions }}>
        <header></header>

        <main>
          <Authorize />
        </main>

        <footer>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}</footer>
      </DataContext.Provider>

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
