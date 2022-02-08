import React, { useState, useEffect, useContext } from "react";

import { DataContext } from "../pages/index";

export default function Authorize(props) {
  const appData = useContext(DataContext);
  console.log(appData);
  return <div>{(appData && appData.accessToken) ? appData.accessToken.user.name : undefined}</div>;
}
