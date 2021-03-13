export default function handler(req, res) {
  console.log('POST: ', req.body.url);

  fetch(req.body.url)
    .then(canvasRes => canvasRes.json())
    .then(canvasData => {
      res.status(200).json(JSON.stringify({
        data: canvasData
      }))
  })

  // res.status(200).json({
  //   data: req.body.url
  // });
}