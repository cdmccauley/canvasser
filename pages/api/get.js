export default async function handler(req, res) {
  // console.log('/api/get.handler()')
  let resStatus = 504
  await fetch(req.body.url)
  .then(canvasRes => {
    if (canvasRes.status) resStatus = canvasRes.status
    return canvasRes.json()
  })
  .then(canvasData => {
    res.status(resStatus).json(JSON.stringify({
      canvasData
    }))
  })
  .catch((err) => console.log(err));
}