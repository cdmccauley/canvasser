export default function handler(req, res) {
  // console.log('/get POST: ', req.body.url);

  fetch(req.body.url)
    .then(canvasRes => canvasRes.json())
    .then(canvasData => {
      res.status(200).json(JSON.stringify({
        canvasData
      }))
  }).catch((err) => console.log(err));
}