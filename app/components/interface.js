import { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import Checkbox from "@mui/material/Checkbox";

import { useSession } from "next-auth/react";

const getData = (setData) =>
  setData
    ? fetch("/api/canvas/submissions")
        .then((res) => {
          if (res?.ok) {
            return res.json();
          } else {
            return res;
          }
        })
        .then((json) => setData(json))
        .catch((e) => console.error("error", e))
    : null;

const getReserved = (course, assignment, student, setReserve) =>
  course && assignment && student && setReserve
    ? fetch(`/api/reserve/${course}/${assignment}/${student}`)
        .then((res) => res.json())
        .then((json) => setReserve(json))
        .catch((e) => console.error("error", e))
    : null;

const requestReserve = (course, assignment, student, setReserve) =>
  course && assignment && student && setReserve
    ? fetch(`/api/reserve/${course}/${assignment}/${student}`, {
        method: "POST",
      })
        .then((res) => {
          if (res?.ok) {
            return res.json();
          } else {
            return res;
          }
        })
        .then((json) => setReserve(json))
        .catch((e) => console.error("error", e))
    : null;

const cleanup = (timeout) => {
  if (timeout) clearTimeout(timeout);
};

const Status = ({ params }) => {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [refreshTimeout, setRefreshTimeout] = useState(undefined);
  const [reserve, setReserve] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (!loaded) setLoaded(true);
    // cleanup on unmount
    return () => cleanup(refreshTimeout);
  }, []);

  useEffect(() => {
    if (loaded) {
      if (refreshTimeout) {
        cleanup(refreshTimeout);
      }

      getReserved(
        params?.row?.courseId,
        params?.row?.assignmentId,
        params?.row?.studentId,
        setReserve
      );

      const seconds = 1000 * 15;
      setRefreshTimeout(
        setTimeout(
          () =>
            getReserved(
              params?.row?.courseId,
              params?.row?.assignmentId,
              params?.row?.studentId,
              setReserve
            ),
          seconds
        )
      );
    }
  }, [loaded]);

  // reserve
  useEffect(() => {
    if (refreshTimeout) {
      cleanup(refreshTimeout);
    }

    const seconds = 1000 * 15;
    setRefreshTimeout(
      setTimeout(
        () =>
          getReserved(
            params?.row?.courseId,
            params?.row?.assignmentId,
            params?.row?.studentId,
            setReserve
          ),
        seconds
      )
    );

    if (!reserve?.by) {
      setChecked(false);
      setDisabled(false);
    } else if (reserve?.by && reserve?.by == session?.user?.email) {
      setChecked(true);
      setDisabled(false);
    } else {
      setChecked(true);
      setDisabled(true);
    }
  }, [reserve]);

  const handleChange = (event) => {
    requestReserve(
      params?.row?.courseId,
      params?.row?.assignmentId,
      params?.row?.studentId,
      setReserve
    );
  };

  return (
    <Checkbox
      disabled={disabled}
      checked={checked}
      onChange={handleChange}
      size="small"
    />
  );
};

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

  useEffect(() => {
    if (!data) {
      getData(setData);
    }
    // cleanup on unmount
    return () => cleanup(refreshTimeout);
  }, []);

  useEffect(() => {
    if (refreshTimeout) {
      cleanup(refreshTimeout);
    }

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
    } else if (data?.status) {
      // TODO: send user error feedback
    }
  }, [data]);

  useEffect(() => {
    if (submissions) {
      setRows(
        submissions
          .map((c) => {
            return c.submissions.map((s, i) => {
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
          .flat()
          .map((s, i) => {
            return { id: i, ...s };
          })
      );
    }
  }, [submissions]);

  return (
    <div>
      {rows ? (
        <DataGrid
          sx={{ m: 2 }}
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
        />
      ) : undefined}
    </div>
  );
}
