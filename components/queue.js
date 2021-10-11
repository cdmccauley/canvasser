import React, { useState, useEffect } from "react";

import useUser from "../data/use-user";
import useCourses from "../data/use-courses";
import useIReserve from "../data/use-i-reserve";
import useQueue from "../data/use-queue";

import { filteredQueue } from "../libs/filtered-queue";
import { statusQueue } from "../libs/status-queue";
import {
  inactiveReservations,
  clearInactiveReservations,
} from "../libs/inactive-reservations";
import { getComparator, stableSort } from "../libs/table-sorters";

import Courses from "../components/courses";
import Priorities from "../components/priorities";
import Refresh from "../components/refresh";
import Filter from "../components/filter";
import SubmissionHeader from "../components/submission-header";
import Submission from "../components/submission";

import {
  Paper,
  Toolbar,
  Typography,
  TableContainer,
  Table,
  TableBody,
} from "@material-ui/core";

export default function Queue(props) {
  // console.log('queue props: ', props)
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("priority");
  const [filter, setFilter] = useState("");
  const [priorities, setPriorities] = useState([]);
  const [refreshRate, setRefreshRate] = useState(60);
  const [activeCourses, setActiveCourses] = useState(null);

  useEffect(() => {
    // get items from storage
    if (localStorage.getItem("priorities"))
      setPriorities(JSON.parse(localStorage.getItem("priorities")));
    if (localStorage.getItem("refreshRate"))
      setRefreshRate(localStorage.getItem("refreshRate"));
    if (localStorage.getItem("activeCourses"))
      setActiveCourses(JSON.parse(localStorage.getItem("activeCourses")));
  }, []);

  // user data from swr
  const { user, userError } = useUser(
    props.canvasUrl && props.apiKey
      ? `${props.canvasUrl}/api/v1/users/self?access_token=${props.apiKey}`
      : null
  );

  // course data from swr
  const { courses, courseError } = useCourses({
    canvasUrl: props.canvasUrl,
    apiKey: props.apiKey,
    user: user,
    activeCourses: activeCourses,
    setActiveCourses: setActiveCourses,
  });

  // davis tech reserve data from swr
  const { iReserve, mutateIReserve } = useIReserve({
    canvasUrl: props.canvasUrl,
    user: user,
    refreshRate: refreshRate,
  });

  // queue data from swr
  const { queue, queueError } = useQueue({
    canvasUrl: props.canvasUrl,
    apiKey: props.apiKey,
    courses: courses,
    reserve: iReserve,
    priorities: priorities,
    refreshRate: refreshRate,
  });

  // early returns to provide loading stage or error feedback
  if (!props.canvasUrl || !props.apiKey) return "Authorization Required";
  if (userError) return "Error Loading User Information";
  if (!user) return "Loading User Information";
  if (courseError) return "Error Loading Courses";
  if (!courses) return "Loading Courses";
  if (!queue && queueError) return "Error Loading Submissions";

  // debugging
  // if (courses) console.log('courses:', courses)
  // if (iReserve) console.log('iReserve:', iReserve)
  // if (queue) console.log('queue:', queue)

  if (courses && !activeCourses) {
    setActiveCourses(
      Array.from(Object.values(courses), (course) => course.code)
    );
    localStorage.setItem(
      "activeCourses",
      JSON.stringify(
        Array.from(Object.values(courses), (course) => course.code)
      )
    );
  }

  // get array of items to be unreserved
  const inactiveReserved =
    queue && iReserve
      ? inactiveReservations(queue, iReserve.selfReserved)
      : null;

  // unreserve
  if (inactiveReserved && inactiveReserved.length > 0)
    clearInactiveReservations(inactiveReserved);

  // filter queue
  const filteredSubmissions =
    activeCourses && courses && queue
      ? filteredQueue(activeCourses, courses, queue, filter)
      : null;

  // get queue with status property attached
  const statusSubmissions =
    filteredSubmissions && iReserve
      ? statusQueue(filteredSubmissions, iReserve)
      : null;

  // const statusSubmissions = useMemo(() => filteredSubmissions && iReserve ? statusQueue(filteredSubmissions, iReserve) : null, [filteredSubmissions, iReserve])

  //set display total
  // the cause of "Warning: Cannot update a component (`Index`) while rendering a different component (`Queue`).""
  props.setSubTotal(
    statusSubmissions && Object.values(statusSubmissions).length > 0
      ? Object.values(statusSubmissions).length
      : 0
  );

  return (
    <Paper>
      <Toolbar>
        <Typography style={{ flex: "1 1 100%" }}>
          {props.subTotal
            ? `${props.subTotal.toString()} Submissions`
            : "Requesting Submissions"}
        </Typography>
        <Courses
          courses={courses}
          activeCourses={activeCourses}
          setActiveCourses={setActiveCourses}
        />
        <Priorities priorities={priorities} setPriorities={setPriorities} />
        <Refresh refreshRate={refreshRate} setRefreshRate={setRefreshRate} />
        <Filter filter={filter} setFilter={setFilter} />
      </Toolbar>
      <TableContainer style={{ marginBottom: "2em" }}>
        <Table>
          <SubmissionHeader
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
          {statusSubmissions ? (
            <TableBody>
              {stableSort(
                stableSort(
                  Object.values(statusSubmissions),
                  getComparator("asc", "submittedAt")
                ),
                getComparator(order, orderBy)
              ).map((submission) => (
                <Submission
                  key={submission.id}
                  user={user}
                  submission={submission}
                  updateIReserve={mutateIReserve}
                />
              ))}
            </TableBody>
          ) : (
            <TableBody></TableBody>
          )}
        </Table>
      </TableContainer>
    </Paper>
  );
}
