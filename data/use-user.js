import useSWR from "swr";

import userFetcher from "../libs/api-user.js";

export default function useUser(url) {
    // console.log('useUser:', url)
    const { data, mutate, error } = useSWR(url, userFetcher);

    const userLoading = !data && !error;
    const userError = error;

    return {
        userLoading,
        userError,
        user: data,
        mutateUser: mutate
    };
}