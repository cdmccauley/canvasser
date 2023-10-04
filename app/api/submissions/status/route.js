import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import privateClientPromise from "@/app/lib/privateMongo";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  if (process.env.NODE_ENV == "development")
    console.log(new Date().toLocaleTimeString(), "status requested");

  const statuses = {
    OK: 200,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };

  let status = statuses.UNAUTHORIZED;
  let payload = [];

  try {
    const apiKey = request.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    if (apiKey === process.env.API_KEY || session) {
      status = statuses.NOT_FOUND;

      const search = {
        name: request?.nextUrl?.searchParams.get("name"),
        id: request?.nextUrl?.searchParams.get("id"),
      };

      const searched =
        apiKey === process.env.API_KEY && search.name && search.id;

      const mongo = await privateClientPromise;
      const oauth = await mongo.db("oauth");
      const accounts = await oauth.collection("accounts");

      // this query may not apply to all users
      const query = {
        "user.name": searched ? search.name : session?.user?.name,
        providerAccountId: searched ? search.id : session?.user?.id,
      };

      const account = await accounts.findOne(query);

      if (account) {
        const reserve = await mongo.db("reserve");
        const active = await reserve.collection("active");

        const options = {
          projection: { _id: 0, created: 0 },
        };

        const reserved = await active.find({}, options);

        if (reserved) {
          payload = await reserved.toArray();
        }

        status = statuses.OK;
      }
    }
  } catch (e) {
    status = statuses.INTERNAL_SERVER_ERROR;
    console.error("/api/canvas/courses error", e);
  } finally {
    return NextResponse.json(payload, {
      status: status,
    });
  }
}
