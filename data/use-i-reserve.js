import useSWR from "swr";

import iReserveFetcher from "../libs/api-i-reserve.js";

export default function useIReserve(props) {
    // console.log('/data.useIReserve()')
    if (props.canvasUrl.includes('davistech.instructure.com')) {
        let iReserve = [];
        const { data, mutate, error } = useSWR('/api/i-reserve', iReserveFetcher, {
            refreshInterval: 30 * 1000, 
            revalidateOnFocus: false,
            refreshWhenHidden: true,
        });

        // console.log('/data.useIReserve() data: ', data)

        if (data && data.length > 0) data.map((reservation) => {
            iReserve.push(reservation._id)
        })

        const iReserveLoading = !data && !error;
        const iReserveError = error && error.status === 403;

        return {
            iReserveLoading,
            iReserveError,
            iReserve: iReserve,
            mutateIReserve: mutate
        };
    } else {
        return {
            iReserveLoading: false,
            iReserveError: false,
            iReserve: [],
            mutateIReserve: null // this may cause an issue
        }
    }
}