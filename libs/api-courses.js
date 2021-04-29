import parseLinkHeader from "../libs/parse-link-header.js";

const coursesFetcher = async (url) => {
    // console.log(`libs/api-courses.coursesFetcher(${url})`)
    let links;
    let resData;
    return await fetch('/api/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url
        })
    })
    .then((res) => {
        // console.log('link headers: ', res.headers.get('link'))
        links = parseLinkHeader(res.headers.get('link'))
        // console.log('next: ', links['next']) // undefined if doesn't exist
        return res.json()
    })
    .then((data) => {
        resData = data
        if (links['next'] != undefined) {
            resData.next = links['next']
        }
        return resData
    })
    .catch((err) => console.log(err));
};
export default coursesFetcher