const queueFetcher = async (url) => {
    // console.log(`libs/api-queue.queueFetcher(${url})`)
    // let reserve = [];
    // if (url.includes('davistech.instructure.com')) {
    //     await fetch('/api/i-reserve')
    //     .then((res) => res.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => console.log(error))
    // }
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
    .catch((error) => console.log('libs/api-queue.queueFetcher() error:', error))
}
export default queueFetcher