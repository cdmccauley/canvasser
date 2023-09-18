import { getServerSession } from "next-auth/next";

import privateClientPromise from "@/app/lib/privateMongo";
import parseLinkHeader from "@/app/lib/parseLinkHeader";

import { NextResponse } from "next/server";

export async function GET(request) {
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
    const session = await getServerSession();

    if (apiKey === process.env.API_KEY || session) {
      status = statuses.ACCEPTED;

      const search = {
        page: request?.nextUrl?.searchParams.get("page"),
        per_page: request?.nextUrl?.searchParams.get("per_page"),
        name: request?.nextUrl?.searchParams.get("name"),
        email: request?.nextUrl?.searchParams.get("email"),
      };

      const searched =
        apiKey === process.env.API_KEY && search.name && search.email;

      const mongo = await privateClientPromise;
      const oauth = await mongo.db("oauth");
      const accounts = await oauth.collection("accounts");

      // this query may not apply to all users
      const query = {
        "profile.name": searched ? search.name : session?.user?.name,
        "profile.email": searched ? search.email : session?.user?.email,
      };

      const account = await accounts.findOne(query);

      if (account && account?.access_token && account?.expires_at) {
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

        if (refresh?.token) {
          const myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${refresh.token}`);

          const requestOptions = {
            method: "GET",
            headers: myHeaders,
          };

          let link;

          const page =
            search?.page &&
            parseInt(search.page) !== Number.NaN &&
            parseInt(search.page) > 0
              ? parseInt(search.page)
              : 1;

          const per_page =
            search?.per_page &&
            parseInt(search.per_page) !== Number.NaN &&
            parseInt(search.per_page) > 0 &&
            parseInt(search.per_page) <= 10 // maximums aren't documented, minimum is 10
              ? parseInt(search.per_page)
              : 10;

          const params = `?page=${page}&per_page=${per_page}`;

          const courseRes = await fetch(
            `${process.env.CANVAS_URL}/api/v1/courses${params}`,
            requestOptions
          )
            .then((res) => {
              if (res.ok) {
                if (res.headers.has("link")) {
                  link = parseLinkHeader(res.headers.get("link"));
                }
                return res.json();
              } else {
                return res;
              }
            })
            .then((json) => json);

          status = statuses.OK;
          payload = courseRes;

          if (link?.next) {
            const myHeaders = new Headers();
            myHeaders.append("x-api-key", process.env.API_KEY);

            const requestOptions = {
              method: "GET",
              headers: myHeaders,
            };

            const params = {
              name: searched ? search.name : session?.user?.name,
              email: searched ? search.email : session?.user?.email,
            };

            const nextPage = await fetch(
              `${root}/api/canvas/courses?page=${page + 1}&per_page=10&name=${
                params.name
              }&email=${params.email}`,
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

            payload = [...payload, ...nextPage];
          }
        }
      }
    }
  } catch (e) {
    status = statuses.INTERNAL_SERVER_ERROR;
    console.error("/api/canvas/courses error", e);
  } finally {
    return NextResponse.json(payload, { status: status });
  }
}
