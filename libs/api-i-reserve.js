const iReserveFetcher = async () => {
    // console.log('libs/api-i-reserve.iReserveFetcher()')
    return await fetch('/api/i-reserve')
    .then((res) => res.json())
    .then((data) => data.iReserve)
};
export default iReserveFetcher