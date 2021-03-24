export default async function handler(req, res) {
  // limit to 10s response https://vercel.com/docs/platform/limits

  console.log('api/get start: ', Math.floor(Date.now() / 1000))
  await fetch(req.body.url)
    .then(canvasRes => canvasRes.json())
    .then(canvasData => {
      res.status(200).json(JSON.stringify({
        canvasData
      }))
      console.log('api/get finish: ', Math.floor(Date.now() / 1000))
  }).catch((err) => console.log(err));
}