import useSWR from "swr";

import refreshFetcher from "../lib/api-refresh.js";

export default function useRefresh(args) {
  //   console.log("data/use-refresh", token);
  const url = "/api/refresh";

  const { token } = args;

  // console.log(new Date(token.expires_at) - new Date());

  const getInterval = (latest) => {
    return latest ? latest.expires_in * 1000 : 5000; //TODO: Math the current token for TTL
  };

  const { data, error } = useSWR([token ? url : null, token], refreshFetcher, {
    revalidateOnFocus: false,
    refreshWhenHidden: true,
    refreshInterval: getInterval,
  });

  return {
    accessToken: data,
    tokenLoading: !error && !data,
    tokenError: error,
  };
}
