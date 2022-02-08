import useSWR from "swr";

import submissionsFetcher from "../lib/api-submissions.js";

export default function useSubmissions(args) {
  //   console.log("data/use-submissions", args);
  const url = "/api/submissions";

  const { accessToken } = args;

  const { data, error } = useSWR([accessToken ? url : null, accessToken], submissionsFetcher, {
    revalidateOnFocus: false,
    refreshWhenHidden: true,
    refreshInterval: 60 * 1000,
  });

  return {
    submissions: data ? data.data : data,
    submissionsLoading: !error && !data,
    submissionsError: error,
  };
}
