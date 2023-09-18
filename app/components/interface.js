"use-client";

import { useState, useEffect } from "react";

export default function Interface() {
  const [courses, setCourses] = useState();

  useEffect(() => {
    if (!courses) {
      console.log("get courses");
      fetch("/api/canvas/courses")
        .then((res) => {
          if (res?.ok) {
            return res.json();
          } else {
            return res;
          }
        })
        .then((json) => console.log(json));
    }
  }, []);

  return <div>Interface</div>;
}
