import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";

export const DataContext = createContext({});

import Authorize from "./authorize";

import useRefresh from "../data/use-refresh";
import useSubmissions from "../data/use-submissions";

export default function Data(props) {
  const subdomain = "davistech";
  const client_id = "140000000000311";
  const state = "temp";
  const redirect_uri = "https://canvasser.vercel.app";
  const url = `https://${subdomain}.instructure.com/login/oauth2/auth?client_id=${client_id}&response_type=code&state=${state}&redirect_uri=${redirect_uri}`;

  // const [darkMode, setDarkMode] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState(undefined);
  const [refresh, setRefresh] = useState(undefined);

  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem("token")));
  }, []);

  const { accessToken, tokenLoading, tokenError } = useRefresh({ token });
//   console.log("/components/data", accessToken, tokenLoading, tokenError);

  const { submissions, submissionsLoading, submissionsError } = useSubmissions({ accessToken })
//   console.log("/components/data", submissions, submissionsLoading, submissionsError);
  
  return (
    <DataContext.Provider value={{accessToken, submissions}}>
      <Authorize />
    </DataContext.Provider>
  );
}
