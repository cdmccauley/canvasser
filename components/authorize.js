import React, { useState, useEffect, useContext } from "react";

import { DataContext } from "./data";

export default function Authorize(props) {
  const swrData = useContext(DataContext);

  return <div>{swrData.id}</div>;
}
