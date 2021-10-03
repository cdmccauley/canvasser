export default async function handler(req, res) {
    // console.log('/api/queue.handler()')
    // simulate random timeouts from canvas
    // const time = Math.floor(Math.random() * 300) + 400
    // console.log('time', time)
    const time = 5900
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), time)
    
    let resStatus = 504
    
    // await fetch(req.body.url)
    await fetch(req.body.url, { signal: controller.signal })
    .then(canvasRes => {
        if (canvasRes.status) resStatus = canvasRes.status
        if (canvasRes.headers.has('link')) {
            res.setHeader('link', canvasRes.headers.get('link'))
        }
        return canvasRes.json()
    })
    .then(canvasData => {
        res.status(resStatus).json(JSON.stringify({
            canvasData
        }))
    })
    .catch((err) => {
        console.log('/api/queue.handler() error:', err)
        clearTimeout(timeoutId)
        res.status(resStatus).json(JSON.stringify(null))
    });
}