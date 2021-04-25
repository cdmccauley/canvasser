export default async function handler(req, res) {
    console.log('/api/queue.handler()')
    await fetch(req.body.url)
    .then(canvasRes => {
        if (canvasRes.headers.has('link')) {
            res.setHeader('link', canvasRes.headers.get('link'))
        }
        return canvasRes.json()
    })
    .then(canvasData => {
    res.status(200).json(JSON.stringify({
        canvasData
    }))
    }).catch((err) => console.log(err));
}