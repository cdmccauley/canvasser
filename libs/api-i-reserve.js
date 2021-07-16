const iReserveFetcher = async () => {
    // console.log('libs/api-i-reserve.iReserveFetcher()')
    return await fetch('/api/i-reserve')
    .then((res) => {
        if (!res.ok) {
            const error = new Error('An error occurred while fetching reserve data.')
            error.info = res.json()
            error.status = res.status
            throw error
        } else {
            return res
        }
    })
    .then((res) => res.json())
    .then((data) => data.iReserve)
    .catch((err) => console.log('iReserveFetcher error:', err))
};
export default iReserveFetcher