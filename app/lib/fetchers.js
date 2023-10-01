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

export const getReserved = (course, assignment, student, setReserve) =>
  course && assignment && student && setReserve
    ? fetch(`/api/reserve/${course}/${assignment}/${student}`)
        .then((res) => res.json()) // changing this causes errors
        .then((json) => setReserve(json))
        .catch((e) => console.error("error", e))
    : null;

export const requestReserve = (course, assignment, student, setReserve) =>
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
