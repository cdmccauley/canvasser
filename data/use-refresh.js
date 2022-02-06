import useSWR from "swr";

import refreshFetcher from "../lib/api-refresh.js";

export default function useRefresh(token) {
  //   console.log("data/use-refresh", token);
  const url = "/api/refresh";
  const { data, error } = useSWR(url, refreshFetcher(token));

  return {
    token: data,
    tokenLoading: !error && !data,
    tokenError: error
  }
}
