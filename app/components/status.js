import { useState, useEffect, useContext } from "react";

import { useSession } from "next-auth/react";

import Checkbox from "@mui/material/Checkbox";

import { requestReserve } from "../lib/fetchers";

import { StatusContext } from "./interface";

const message = (name) => `🚨 Unable To Reserve Assignment 🚨\n\n📄 ${name}`;

export default function Status({ params }) {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState();

  const statuses = useContext(StatusContext);

  const { data: session } = useSession();

  // []
  useEffect(() => {
    if (statuses?.length > 0) {
      const reserve = statuses.find(
        (s) =>
          s?.course &&
          params?.row?.courseId &&
          s.course == params.row.courseId &&
          s?.assignment &&
          params?.row?.assignmentId &&
          s.assignment == params.row.assignmentId &&
          s?.student &&
          params?.row?.studentId &&
          s.student == params.row.studentId
      );

      if (reserve?.by && session?.user?.id) {
        if (reserve.by == session.user.id) {
          setChecked(true);
          setDisabled(false);
        } else if (reserve.by != session.user.id) {
          if (checked && !disabled) {
            const notification = new Notification(
              "Canvasser Reservation Warning",
              { body: message(params?.row?.name) }
            );
          }
          setChecked(true);
          setDisabled(true);
        }
      } else {
        setChecked(false);
        setDisabled(false);
      }
    }
  }, [statuses]);

  // [status]
  useEffect(() => {
    if (status?.reserved && status?.by && session?.user?.id) {
      if (status.by == session.user.id) {
        setChecked(true);
        setDisabled(false);
      } else if (status.by != session.user.id) {
        if (checked && !disabled) {
          const notification = new Notification(
            "Canvasser Reservation Warning",
            { body: message(params?.row?.name) }
          );
        }
        setChecked(true);
        setDisabled(true);
      }
    } else {
      setChecked(false);
      setDisabled(false);
    }
  }, [status]);

  const handleChange = (event) => {
    // call fetcher
    setChecked(!checked);

    // data for production debugs
    const date = new Date();
    localStorage.setItem(
      "last_reserve_request",
      JSON.stringify({
        epoch: date.valueOf(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
      })
    );

    requestReserve(
      params?.row?.courseId,
      params?.row?.assignmentId,
      params?.row?.studentId,
      setStatus
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
