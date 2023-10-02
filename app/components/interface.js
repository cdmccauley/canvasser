import { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import Loading from "./loading";
import Status from "./status";

import { getData } from "../lib/fetchers";
import { cleanup } from "../lib/helpers";

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
    flex: 1,
    renderCell: (params) => (
      <a href={params.row.assignment} target="_blank">
        {params.row.name}
      </a>
    ),
    valueGetter: (params) => {
      return params.row.name;
    },
  },
];

export default function Interface() {
  const [data, setData] = useState();
  const [refreshTimeout, setRefreshTimeout] = useState();
  const [courses, setCourses] = useState();
  const [submissions, setSubmissions] = useState();
  const [rows, setRows] = useState();

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
      // the graphql query returns courses without submissions
      const filterForSubmissions = data.data.allCourses.filter(
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

  // [submissions]
  useEffect(() => {
    if (submissions) {
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

  return (
    <>
      {rows && rows?.length > 0 ? (
        <DataGrid
          sx={{ m: 2 }}
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
        />
      ) : (
        <Loading />
      )}
    </>
  );
}
