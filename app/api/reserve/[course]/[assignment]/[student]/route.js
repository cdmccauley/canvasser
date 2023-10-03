import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import privateClientPromise from "@/app/lib/privateMongo";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  if (process.env.NODE_ENV == "development")
    console.log(new Date().toLocaleTimeString(), "reserve requested (GET)");

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
  let payload = { reserved: false, by: null };

  try {
    const apiKey = request.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    if (apiKey === process.env.API_KEY || session) {
      status = statuses.NOT_FOUND;

      const search = {
        course: params.course,
        assignment: params.assignment,
        student: params.student,
        name: params.name,
        id: params.id,
      };

      const searched =
        apiKey === process.env.API_KEY &&
        search.course &&
        search.assignment &&
        search.student &&
        search.name &&
        search.id;

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

        const query = {
          course: search.course,
          assignment: search.assignment,
          student: search.student,
        };

        const reserved = await active.findOne(query);

        if (reserved) {
          payload = { reserved: true, by: reserved.by };
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

export async function POST(request, { params }) {
  if (process.env.NODE_ENV == "development")
    console.log(new Date().toLocaleTimeString(), "reserve requested (POST)");

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
  let payload = { reserved: false, by: null };

  try {
    const apiKey = request.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    if (apiKey === process.env.API_KEY || session) {
      status = statuses.NOT_FOUND;

      const search = {
        course: params.course,
        assignment: params.assignment,
        student: params.student,
        name: params.name,
        id: params.id,
      };

      const searched =
        apiKey === process.env.API_KEY &&
        search.course &&
        search.assignment &&
        search.student &&
        search.name &&
        search.id;

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

        const query = {
          course: search.course,
          assignment: search.assignment,
          student: search.student,
        };

        const reserved = await active.findOne(query);

        const by = searched ? search.id : session?.user?.id;

        if (reserved && reserved?.by == by) {
          await active.deleteOne({
            course: search.course,
            assignment: search.assignment,
            student: search.student,
            by: by,
          });
          payload = { reserved: false, by: null };
        } else if (reserved) {
          payload = { reserved: true, by: reserved.by };
        } else {
          const date = new Date();
          await active.insertOne({
            course: search.course,
            assignment: search.assignment,
            student: search.student,
            by: by,
            created: { epoch: date.valueOf(), utc: date.toUTCString() },
          });
          payload = { reserved: true, by: by };
        }

        status = statuses.OK;
      }
    }
  } catch (e) {
    status = statuses.INTERNAL_SERVER_ERROR;
    console.error("/api/canvas/courses error", e);
  } finally {
    return NextResponse.json(payload, { status: status });
  }
}
