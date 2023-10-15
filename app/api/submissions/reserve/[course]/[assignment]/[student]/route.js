import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import privateClientPromise from "@/app/lib/privateMongo";

import { NextResponse } from "next/server";

const statuses = {
  OK: 200,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export async function POST(request, { params }) {
  if (process.env.NODE_ENV == "development")
    console.log(new Date().toLocaleTimeString(), "reserve POST");

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
        name: request?.nextUrl?.searchParams.get("name"),
        id: request?.nextUrl?.searchParams.get("id"),
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
    console.error("/api/submissions/reserve POST error", e);
  } finally {
    return NextResponse.json(payload, { status: status });
  }
}

export async function DELETE(request, { params }) {
  if (process.env.NODE_ENV == "development")
    console.log(new Date().toLocaleTimeString(), "reserve DELETE");

  let status = statuses.UNAUTHORIZED;
  let data = {
    message: "Authentication is required to access this resource",
  };

  try {
    const apiKey = request.headers.get("x-api-key");
    const session = await getServerSession(authOptions);
    const date = new Date();

    if (apiKey === process.env.API_KEY || session) {
      status = statuses.ACCEPTED;
      data = {
        message: "The request has been accepted for processing",
      };

      const search = {
        course: params.course,
        assignment: params.assignment,
        student: params.student,
        name: request?.nextUrl?.searchParams.get("name"),
        id: request?.nextUrl?.searchParams.get("id"),
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

        const oneQuery = {
          course: search.course,
          assignment: search.assignment,
          student: search.student,
        };

        await active.deleteOne(oneQuery);

        const expiration = date.setUTCDate(date.getUTCDate() - 1);
        const manyQuery = {
          "created.epoch": { $lt: expiration },
        };

        await active.deleteMany(manyQuery);
      }
    }
  } catch (e) {
    status = statuses.INTERNAL_SERVER_ERROR;
    data = {
      message: "Internal Server Error",
    };
    console.error("/api/submissions/reserve DELETE error", e);
  } finally {
    return NextResponse.json(data, { status: status });
  }
}
