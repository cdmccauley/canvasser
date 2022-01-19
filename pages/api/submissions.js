export default async function handler(req, res) {
    console.log("/api/submissions.handler()");
    const url = "https://davistech.instructure.com/login/oauth2/token";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${req.access_token}`
      },
      body: `query=query PendingReview {
        allCourses {
          _id
          submissionsConnection(filter: {states: pending_review}) {
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
      }`,
    })
      .then((canvas_res) => canvas_res.json())
      .then((data) => {
        console.log(data);
        res.status(200).json(
          JSON.stringify(data)
        );
      })
      .catch((err) => console.log(err));
  }
  