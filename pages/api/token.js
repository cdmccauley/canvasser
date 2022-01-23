export default async function handler(req, res) {
//   console.log("/api/token.handler()");
  const url = "https://davistech.instructure.com/login/oauth2/token";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: "https://canvasser.vercel.app", // TODO: update to /token
      code: req.body.code,
    }),
  })
    .then((canvas_res) => canvas_res.json())
    .then((data) => {
    //   console.log(data);
      res.status(200).json(
        JSON.stringify(data)
      );
    })
    .catch((err) => console.error(err));
}
