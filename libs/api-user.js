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
    .then((res) => {
        if (!res.ok) {
            const error = new Error('An error occurred while fetching user data.')
            error.info = res.json()
            error.status = res.status
            throw error
        } else {
            return res
        }
    })
    .then((res) => res.json())
    .then((data) => data.canvasData)
    .catch((err) => console.log('userFetcher error:', err))
};
export default userFetcher