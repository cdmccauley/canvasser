const userFetcher = async (url) => {
    // console.log('libs/api-user.userFetcher(): ', url)
    return await fetch('/api/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url
        })
    })
    .then((res) => res.json())
    .then((data) => data.canvasData)
};
export default userFetcher