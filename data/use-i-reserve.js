import useSWR from "swr";

import iReserveFetcher from "../libs/api-i-reserve.js";

export default function useIReserve(props) {
    // console.log('/data.useIReserve()')
    let iReserve = { 
        reserved: [],
        selfReserved: []
    };
    if (props.canvasUrl.includes('davistech.instructure.com')) {
        const { data, mutate, error } = useSWR('/api/i-reserve', iReserveFetcher, {
            refreshInterval: props.refreshRate * 1000, 
            revalidateOnFocus: false,
            refreshWhenHidden: true,
        });

        if (data && data.length > 0) data.map((reservation) => {
            reservation.grader && reservation.grader.includes(props.user.name) ? iReserve.selfReserved.push(reservation._id) : iReserve.reserved.push(reservation._id);
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
            iReserve: iReserve,
            mutateIReserve: null
        }
    }
}