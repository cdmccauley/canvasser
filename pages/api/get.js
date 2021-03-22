export default function handler(req, res) {
  // console.log('/get POST: ', req.body.url);
  console.log('/get: ', req.method)

  fetch(req.body.url)
    .then(canvasRes => canvasRes.json())
    .then(canvasData => {
      console.log('responding')
      res.status(200).json(JSON.stringify({
        canvasData
      }))
  }).catch((err) => console.log(err));
}