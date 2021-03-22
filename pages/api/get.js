export default async function handler(req, res) {
  // console.log('/get POST: ', req.body.url);
  console.log('/get: ', req.method, 'with: ', req.body.url)

  await fetch(req.body.url)
    .then(canvasRes => canvasRes.json())
    .then(canvasData => {
      console.log('responding with: ', canvasData)
      res.status(200).json(JSON.stringify({
        canvasData
      }))
  }).catch((err) => console.log(err));
}