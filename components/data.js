import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";

export const DataContext = createContext({});

import useRefresh from "../data/use-refresh";

import Authorize from "./authorize";

export default function Data(props) {
  const subdomain = "davistech";
  const client_id = "140000000000311";
  const state = "temp";
  const redirect_uri = "https://canvasser.vercel.app";
  const url = `https://${subdomain}.instructure.com/login/oauth2/auth?client_id=${client_id}&response_type=code&state=${state}&redirect_uri=${redirect_uri}`;

  const swrData = { id: "swrData" };

  // const [darkMode, setDarkMode] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState(undefined);
  const [refresh, setRefresh] = useState(undefined);

  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem("token")));
  }, []);

  const { refreshToken, tokenLoading, tokenError } = useRefresh(token);
  console.log("USEREFRESH:", refreshToken, tokenLoading, tokenError);
  console.log("DATA");

  return (
    <DataContext.Provider value={swrData}>
      <Authorize />
    </DataContext.Provider>
  );
}
