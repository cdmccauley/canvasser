import useSWR from "swr";

import userFetcher from "../libs/api-user.js";

export default function useUser(url) {
    // console.log('useUser:', url)
    const { data, mutate, error } = useSWR(url, userFetcher);

    const loading = !data && !error;
    const errored = error && error.status === 403;

    return {
        loading,
        errored,
        user: data,
        mutate
    };
}