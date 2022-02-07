import useSWR from "swr";

import refreshFetcher from "../lib/api-refresh.js";

export default function useRefresh(args) {
  //   console.log("data/use-refresh", token);
  const url = "/api/refresh";

  const { token } = args;

  const { data, error } = useSWR([token ? url : null, token], refreshFetcher);

  return {
    accessToken: data,
    tokenLoading: !error && !data,
    tokenError: error,
  };
}
