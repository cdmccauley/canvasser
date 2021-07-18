import parseLinkHeader from "../libs/parse-link-header.js";

const queueFetcher = async (url) => {
    // console.log(`libs/api-queue.queueFetcher(${url})`)
    // let reserve = [];
    // if (url.includes('davistech.instructure.com')) {
    //     await fetch('/api/i-reserve')
    //     .then((res) => res.json())
    //     .then((data) => console.log(data))
    //     .catch((error) => console.log(error))
    // }
    let links;
    let resData;
    return await fetch('/api/queue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url
        })
    })
    .then((res) => {
        if (!res.ok) {
            const error = new Error('An error occurred while fetching queue data.')
            error.info = res.json()
            error.status = res.status
            throw error
        } else {
            return res
        }
    })
    .then((res) => {
        links = parseLinkHeader(res.headers.get('link'))
        return res.json()
    })
    .then((data) => {
        // console.log('api-queue data: ', data);
        resData = data
        if (links['next'] != undefined) {
            resData.next = links['next']
        }
        return resData
    })
    .catch((error) => {
        console.log('libs/api-queue.queueFetcher() error:', error)
        throw err
    })
}
export default queueFetcher