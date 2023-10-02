import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

import Checkbox from "@mui/material/Checkbox";

import { getReserved, requestReserve } from "../lib/fetchers";
import { cleanup } from "../lib/helpers";

// setup timer for next api call
const setup = (seconds, timeout, call, params, setter) => {
  // data for production debugs
  const date = new Date();
  localStorage.setItem(
    "last_status_refresh",
    JSON.stringify({
      epoch: date.valueOf(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
    })
  );

  const miliseconds = 1000 * seconds;
  // set the timeout value for cleanup
  timeout(
    setTimeout(
      () =>
        // call the fetcher
        call(
          params?.row?.courseId,
          params?.row?.assignmentId,
          params?.row?.studentId,
          setter
        ),
      miliseconds
    )
  );
};

export default function Status({ params }) {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loaded, setLoaded] = useState();
  const [refreshTimeout, setRefreshTimeout] = useState();
  const [reserve, setReserve] = useState();

  const { data: session } = useSession();

  // []
  useEffect(() => {
    if (!loaded) setLoaded(true);
    // cleanup on unmount
    return () => cleanup(refreshTimeout);
  }, []);

  // [loaded]
  useEffect(() => {
    // clear the current timer
    if (refreshTimeout) {
      cleanup(refreshTimeout);
    }

    if (loaded) {
      // check reserve status
      getReserved(
        params?.row?.courseId,
        params?.row?.assignmentId,
        params?.row?.studentId,
        setReserve
      );

      // start the next timer
      setup(15, setRefreshTimeout, getReserved, params, setReserve);
    }
  }, [loaded]);

  // [reserve]
  useEffect(() => {
    // clear the current timer
    if (refreshTimeout) {
      cleanup(refreshTimeout);
    }

    // start the next timer
    setup(15, setRefreshTimeout, getReserved, params, setReserve);

    // update status checkbox
    if (!reserve?.by) {
      setChecked(false);
      setDisabled(false);
    } else if (reserve?.by && reserve?.by == session?.user?.email) {
      setChecked(true);
      setDisabled(false);
    } else {
      if (checked && !disabled) {
        const notification = new Notification(
          `🚨 Unable To Reserve Assignment 🚨\n${params?.row?.name}`
        );
      }
      setChecked(true);
      setDisabled(true);
    }
  }, [reserve]);

  const handleChange = (event) => {
    // call fetcher
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
}
