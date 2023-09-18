import privateClientPromise from "@/app/lib/privateMongo";

import { ObjectId } from "mongodb";

import { NextResponse } from "next/server";

export async function GET(request) {
  const statuses = {
    OK: 200,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
  };

  let status = statuses.UNAUTHORIZED;
  let payload = {};

  try {
    const apiKey = request.headers.get("x-api-key");

    if (apiKey === process.env.API_KEY) {
      status = statuses.BAD_REQUEST;

      const search = {
        id: request?.nextUrl?.searchParams.get("id"),
      };

      if (search?.id) {
        status = statuses.NOT_FOUND;

        const mongo = await privateClientPromise;
        const oauth = await mongo.db("oauth");
        const accounts = await oauth.collection("accounts");

        const query = {
          _id: new ObjectId(search.id),
        };

        const account = await accounts.findOne(query);

        if (account && account?.access_token && account?.expires_at) {
          status = statuses.OK;
          payload = { token: account.access_token };

          const date = new Date();
          const now = date.valueOf();
          const expires = account.expires_at * 1000;

          if (now >= expires && account?.refresh_token) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              grant_type: "refresh_token",
              client_id: process.env.CANVAS_CLIENT_ID,
              client_secret: process.env.CANVAS_CLIENT_SECRET,
              refresh_token: account.refresh_token,
            });

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
            };

            const refreshed = await fetch(
              `${process.env.CANVAS_URL}/login/oauth2/token`,
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

            if (refreshed?.access_token && refreshed?.expires_in) {
              payload = { token: refreshed.access_token };

              await accounts.updateOne(
                { _id: account._id },
                {
                  $set: {
                    access_token: refreshed.access_token,
                    expires_at: Math.floor(now / 1000) + refreshed.expires_in,
                    updated: {
                      by: "/api/canvas/refresh",
                      utc: date.toUTCString(),
                      epoch: now,
                    },
                  },
                }
              );
            } else {
              status = statuses.BAD_GATEWAY;
            }
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
