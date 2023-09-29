import { useState, useEffect } from "react";

const getData = (setData) =>
  fetch("/api/canvas/submissions")
    .then((res) => {
      if (res?.ok) {
        return res.json();
      } else {
        return res;
      }
    })
    .then((json) => setData(json))
    .catch((e) => console.error("error", e));

const cleanup = (timeout) => {
  if (timeout) {
    console.log("clearing timeout");
    clearTimeout(timeout);
  } else {
    console.log("no timeout");
  }
};

export default function Interface() {
  const [data, setData] = useState();
  const [refreshTimeout, setRefreshTimeout] = useState();
  const [courses, setCourses] = useState();
  const [submissions, setSubmissions] = useState();

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

      setSubmissions(
        data.data.allCourses
          .map((c) => {
            if (c?.submissionsConnection?.nodes?.length > 0)
              return {
                id: c._id,
                sisId: c.sisId,
                name: c.name,
                submissions: c?.submissionsConnection?.nodes,
              };
          })
          .filter((s) => s) // remove undefined values
      );
    } else if (data?.status) {
      // TODO: send user error feedback
    }
  }, [data]);

  useEffect(() => {
    if (courses) console.log("courses", courses);
  }, [courses]);

  useEffect(() => {
    if (submissions) console.log("submissions", submissions);
  }, [submissions]);

  return <div>Interface</div>;
}
