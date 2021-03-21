export default function handler(req, res) {
  let queue = [];
  let urlParameters;
  urlParameters = "student_ids[]=all";
  urlParameters += "&include[]=assignment";
  urlParameters += "&workflow_state[]=submitted";
  urlParameters += "&workflow_state[]=pending_review";
  urlParameters += "&enrollment_state=active";

  let timer = 0;
  (async ()=> {
    await Promise.all(req.body.courses.map((course) => {
      timer += 10 // 10 seems to address the throttling issue, able to make 1 req/sec with 55 courses and no 403's
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(fetch(`${req.body.url}/api/v1/courses/${course.id}/students/submissions?${urlParameters}&access_token=${req.body.key}`))
        }, timer)
      }).then((courseRes) => {
        if (courseRes.status == 200) {
          return courseRes.json()
        } else {
          console.log(courseRes.status, ' at ', new Date().toLocaleTimeString(), ' with ', req.body.courses.length, ' courses')
          // console.log(courseRes.headers)
          return [] // in case of 403, https://canvas.instructure.com/doc/api/file.throttling.html
        }
      })
      .then((data) => {
        if (data.length > 0) {
          data.forEach((submission) => {
            queue.push({
              courseId: course.id,
              courseName: course.name,
              courseUrl: `${req.body.url}/courses/${submission.assignment.course_id}/grades/${submission.user_id}`,
              name: submission.assignment.name,
              assignmentId: submission.assignment_id,
              id: submission.id,
              submittedAt: submission.submitted_at,
              url: `${req.body.url}/courses/${submission.assignment.course_id}/gradebook/speed_grader?assignment_id=${submission.assignment_id}&student_id=${submission.user_id}`,
              userId: submission.user_id,
            })
          })
        }
      })
      .catch((err) => console.log(err.toString()))
    })).then(() => res.status(200).json(JSON.stringify({ queue })))
  })();

  // Math.floor((Math.random * 500) + 1)
  // (async () => {
  //   await Promise.all(req.body.courses.map((course) => {
  //     return fetch(`${req.body.url}/api/v1/courses/${course.id}/students/submissions?${urlParameters}&access_token=${req.body.key}`)
  //     .then((courseRes) => {
  //       if (courseRes.status == 200) {
  //         return courseRes.json()
  //       } else {
  //         console.log(courseRes.status)
  //         // console.log(courseRes.headers)
  //         return [] // TODO: change this temp fix for 403's, https://canvas.instructure.com/doc/api/file.throttling.html
  //       }
  //     })
  //     .then((data) => {
  //       if (data.length > 0) {
  //         data.forEach((submission) => {
  //           queue.push({
  //             courseId: course.id,
  //             courseName: course.name,
  //             courseUrl: `${req.body.url}/courses/${submission.assignment.course_id}/grades/${submission.user_id}`,
  //             name: submission.assignment.name,
  //             assignmentId: submission.assignment_id,
  //             id: submission.id,
  //             submittedAt: submission.submitted_at,
  //             url: `${req.body.url}/courses/${submission.assignment.course_id}/gradebook/speed_grader?assignment_id=${submission.assignment_id}&student_id=${submission.user_id}`,
  //             userId: submission.user_id,
  //           })
  //         })
  //       }
  //     })
  //     .catch((err) => console.log(err.toString()))
      
  //   })).then(() => res.status(200).json(JSON.stringify({ queue })))
  // })();
}