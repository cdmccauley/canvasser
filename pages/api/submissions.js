export default async function handler(req, res) {
  //   console.log("/api/submissions.handler()");
  // TODO: get subdomain from req.body
  const url = "https://davistech.instructure.com/api/graphql";
  const query = `
    query PendingReview {
      allCourses {
          _id
          submissionsConnection(filter: {states: [submitted, pending_review]}) {
              edges {
                  node {
                      postedAt
                      _id
                      assignment {
                          _id
                          name
                      }
                      user {
                          name
                          _id
                          avatarUrl
                          sisId
                          sortableName
                      }
                  }
              }
          }
          courseCode
          name
        }
    }`;
  // TODO: check status, throw error, respond on error
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.body.access_token}`,
    },
    body: JSON.stringify({ query }),
  })
    .then((canvas_res) => {
      if (!canvas_res.ok) {
        const ex = new Error("data request failed");
        ex.info = canvas_res.json();
        ex.status = canvas_res.status;
        throw ex;
      } else {
        return canvas_res.json();
      }
    })
    .then((data) => {
      //   console.log(data);
      res.status(200).json(JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(JSON.stringify(err));
    });
}
