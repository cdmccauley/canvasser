import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

import privateClientPromise from "@/app/lib/privateMongo";

import { NextResponse } from "next/server";

export async function GET(request) {
  if (process.env.NODE_ENV == "development")
    console.log(new Date().toLocaleTimeString(), "submissions requested");

  const statuses = {
    OK: 200,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
  };

  let status = statuses.UNAUTHORIZED;
  let payload = [];

  try {
    const apiKey = request.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    if (apiKey === process.env.API_KEY || session) {
      status = statuses.ACCEPTED;

      const search = {
        name: request?.nextUrl?.searchParams.get("name"),
        id: request?.nextUrl?.searchParams.get("id"),
      };

      const searched =
        apiKey === process.env.API_KEY && search.name && search.email;

      const mongo = await privateClientPromise;
      const oauth = await mongo.db("oauth");
      const accounts = await oauth.collection("accounts");

      // this query may not apply to all users
      const query = {
        "user.name": searched ? search.name : session?.user?.name,
        providerAccountId: searched ? search.id : session?.user?.id,
      };

      const account = await accounts.findOne(query);

      const date = new Date();
      let token = account?.access_token;

      if (
        account &&
        token &&
        account?.expires_at &&
        account?.expires_at * 1000 <= date.valueOf()
      ) {
        const root =
          process.env.NODE_ENV === "development"
            ? process.env.DEV_HOST
            : process.env.PRODUCTION_HOST;

        const refreshHeaders = new Headers();
        refreshHeaders.append("x-api-key", process.env.API_KEY);

        const refreshOptions = {
          method: "GET",
          headers: refreshHeaders,
        };

        const refresh = await fetch(
          `${root}/api/canvas/refresh?id=${account._id}`,
          refreshOptions
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              return res;
            }
          })
          .then((json) => json);

        token = refresh?.token;
      }

      if (account && token) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        // limit to last 180 days
        date.setDate(date.getDate() - 180);
        const submittedSince = date.toISOString();

        const graphql = JSON.stringify({
          query: `query PendingReview {\r\n  allCourses {\r\n    _id\r\n    name\r\n    sisId\r\n    submissionsConnection(filter: {states: [submitted, pending_review], submittedSince: \"${submittedSince}\"}) {\r\n      edges {\r\n        node {\r\n          submittedAt\r\n          assignment {\r\n            _id\r\n            courseId\r\n            name\r\n          }\r\n          user {\r\n            _id\r\n            avatarUrl\r\n            name\r\n            sisId\r\n            sortableName\r\n            enrollments(currentOnly: true, excludeConcluded: true) {\r\n              course {\r\n                _id\r\n                courseCode\r\n                name\r\n                sisId\r\n              }\r\n              sisRole\r\n              state\r\n            }\r\n          }\r\n        }\r\n      }\r\n    }\r\n  }\r\n}\r\n`,
          variables: {},
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: graphql,
        };

        const courseRes = await fetch(
          `${process.env.CANVAS_URL}/api/graphql`,
          requestOptions
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              return res;
            }
          })
          .then((json) => json);

        status = statuses.OK;
        payload = courseRes;
      }
    }
  } catch (e) {
    status = statuses.INTERNAL_SERVER_ERROR;
    console.error("/api/canvas/courses error", e);
  } finally {
    return NextResponse.json(payload, { status: status });
  }
}
