export const getData = (setData) =>
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

export const getStatus = (setStatus) =>
  setStatus
    ? fetch("/api/submissions/status")
        .then((res) => {
          if (res?.ok) {
            return res.json();
          } else {
            return res;
          }
        })
        .then((json) => setStatus(json))
        .catch((e) => console.error("error", e))
    : null;

export const requestReserve = (course, assignment, student, setReserve) =>
  course && assignment && student && setReserve
    ? fetch(`/api/submissions/reserve/${course}/${assignment}/${student}`, {
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
