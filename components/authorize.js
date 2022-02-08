import React, { useState, useEffect, useContext } from "react";

import { DataContext } from "./data";

export default function Authorize(props) {
  const appData = useContext(DataContext);
  console.log(appData);
  return <div>{appData ? appData.accessToken.user.name : undefined}</div>;
}
