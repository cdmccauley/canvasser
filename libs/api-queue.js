const queueFetcher = async (url) => {
    // console.log(`libs/api-queue.queueFetcher(${url})`)
    return await fetch('/api/queue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url
        })
    })
    .then((res) => res.json())
    .then((data) => data)
}
export default queueFetcher