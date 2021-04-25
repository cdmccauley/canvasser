export default async function handler(req, res) {
  console.log('/api/get.handler()')
  await fetch(req.body.url)
  .then(canvasRes => canvasRes.json())
  .then(canvasData => {
    res.status(200).json(JSON.stringify({
      canvasData
    }))
  })
  .catch((err) => console.log(err));
}