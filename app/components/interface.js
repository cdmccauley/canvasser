import { useState, useEffect, createContext, useContext } from "react";

import { DataGrid } from "@mui/x-data-grid";

import { Link } from "@mui/material";

import Loading from "./loading";
import Status from "./status";

import { getData, getStatus } from "../lib/fetchers";

export const StatusContext = createContext();

import { StateContext } from "../provider";

// functions
export const cleanup = (timeout) => {
  if (timeout) clearTimeout(timeout);
};

// column structure and options
const columns = [
  {
    field: "status",
    headerName: "Status",
    flex: 0,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => <Status params={params} />,
  },
  { field: "course", headerName: "Course", flex: 1 },
  {
    field: "assignment",
    headerName: "Assignment",
    flex: 2,
    renderCell: (params) => (
      <Link href={params.row.assignment} target="_blank">
        {params.row.name}
      </Link>
    ),
    valueGetter: (params) => {
      return params.row.name;
    },
  },
  {
    field: "submitted",
    headerName: "Submitted",
    type: "dateTime",
    flex: 1,
    valueGetter: (params) => {
      return new Date(params.row.submitted);
    },
  },
];

export default function Interface() {
  const [data, setData] = useState();
  const [refreshTimeout, setRefreshTimeout] = useState();
  const [courses, setCourses] = useState();
  const [submissions, setSubmissions] = useState();
  const [rows, setRows] = useState();
  const [statuses, setStatuses] = useState();

  const state = useContext(StateContext);

  // []
  useEffect(() => {
    if (!data) {
      getData(setData);
    }
    // cleanup on unmount
    return () => cleanup(refreshTimeout);
  }, []);

  // [data]
  useEffect(() => {
    if (refreshTimeout) {
      cleanup(refreshTimeout);
    }

    // data for production debugs
    const date = new Date();
    localStorage.setItem(
      "last_submission_refresh",
      JSON.stringify({
        epoch: date.valueOf(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
      })
    );

    const seconds = 1000 * 15;
    setRefreshTimeout(setTimeout(() => getData(setData), seconds));

    if (data?.data?.allCourses && data.data.allCourses?.length > 0) {
      setCourses(
        data.data.allCourses.map((c) => {
          return { id: c._id, sisId: c.sisId, name: c.name };
        })
      );

      // prepare to set submissions
      const filterForDisabled =
        Array.isArray(state?.disabled) && state.disabled.length > 0
          ? data.data.allCourses.filter((c) => !state.disabled.includes(c._id))
          : data.data.allCourses;

      // the graphql query returns courses without submissions
      const filterForSubmissions = filterForDisabled.filter(
        (c) => c?.submissionsConnection?.edges?.length > 0
      );

      let parsed = {};

      // the graphql query returns submissions from inactive users
      // load parsed with submissions from active users
      filterForSubmissions.forEach((c) => {
        c.submissionsConnection.edges.forEach((s) => {
          if (s?.node?.user?.enrollments?.length > 0)
            s.node.user.enrollments.forEach((e) => {
              if (c._id == e.course._id) {
                // course is in users active enrollments
                parsed[`${c._id}`] // prop?
                  ? (parsed[`${c._id}`] = [...parsed[`${c._id}`], s.node]) // merge
                  : (parsed[`${c._id}`] = [s.node]); // write new
              }
            });
        });
      });

      // copy results out
      const coursesWithActiveSubmissions = filterForSubmissions
        .map((c) => {
          return {
            id: c._id,
            name: c.name,
            sisId: c.sisId,
            submissions: parsed[`${c._id}`],
          };
        })
        .filter((c) => c.submissions); // filter out the courses where all submissions are inactive users

      setSubmissions(coursesWithActiveSubmissions);
    } else if (data) {
      // TODO: send user error feedback
      // data for production debugs
      const date = new Date();
      localStorage.setItem(
        "last_unexpected_data",
        JSON.stringify({
          epoch: date.valueOf(),
          utc: date.toUTCString(),
          local: date.toLocaleString(),
          data: JSON.stringify(data),
        })
      );
      console.warn("unexpected data", data);
    }
  }, [data]);

  useEffect(() => {
    if (state?.set && courses) state.set({ ...state, courses: courses });
  }, [courses]);

  // [submissions]
  useEffect(() => {
    if (submissions) {
      // data for production debugs
      const date = new Date();
      localStorage.setItem(
        "last_status_refresh",
        JSON.stringify({
          epoch: date.valueOf(),
          utc: date.toUTCString(),
          local: date.toLocaleString(),
          statuses: JSON.stringify(statuses),
        })
      );

      getStatus(setStatuses);

      // set row props
      setRows(
        submissions
          .map((c) => {
            return c.submissions.map((s) => {
              return {
                courseId: c?.id,
                assignmentId: s?.assignment?._id,
                studentId: s?.user?._id,
                course: c?.name,
                name: s?.assignment?.name,
                assignment: `https://davistech.instructure.com/courses/${c.id}/gradebook/speed_grader?assignment_id=${s.assignment._id}&student_id=${s.user._id}`,
                submitted: s?.submittedAt
                  ? new Date(s?.submittedAt).valueOf()
                  : 0,
              };
            });
          })
          .flat() // merge returned sub arrays
          .map((s, i) => {
            return { id: i, ...s }; // assign an id field for react
          })
      );
    }
  }, [submissions]);

  // [rows]
  useEffect(() => {
    if (rows && rows?.length) {
      document.title = `Canvasser (${rows.length})`;
    } else {
      document.title = `Canvasser`;
    }
  }, [rows]);

  // [state.disabled]
  // TODO: find another way to filter the submissions while retaining it's initial state so we don't lose data before the next refresh
  useEffect(() => {
    if (submissions && Array.isArray(state?.disabled)) {
      setSubmissions(submissions.filter((c) => !state.disabled.includes(c.id)));
    }
  }, [state.disabled]);

  return (
    <>
      {rows && rows?.length > 0 ? (
        <StatusContext.Provider value={statuses}>
          <DataGrid
            sx={{ m: 2 }}
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
          />
        </StatusContext.Provider>
      ) : (
        <Loading />
      )}
    </>
  );
}