export default async function handler(req, res) {
  // console.log("/api/refresh", req.body);
  const url = "https://davistech.instructure.com/login/oauth2/token";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: req.body.refresh_token,
    }),
  })
    .then((canvas_res) => {
      if (!canvas_res.ok) {
        const ex = new Error("refresh token request failed");
        ex.info = canvas_res.json();
        ex.status = canvas_res.status;
        throw ex;
      } else {
        return canvas_res.json();
      }
    })
    .then((data) => {
      // console.log("/api/refresh", data);
      res.status(200).json(JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(JSON.stringify(err));
    });
}
