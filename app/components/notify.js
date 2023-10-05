import { useState, useEffect } from "react";

import IconButton from "@mui/material/IconButton";

import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

const handleCheck = () => {
  if (!("Notification" in window) || Notification.permission === "granted") {
    return false;
  } else if (Notification.permission !== "denied") {
    return true;
  }
};

export default function Notify() {
  const [loaded, setLoaded] = useState();
  const [displayed, setDisplayed] = useState(true);

  // []
  useEffect(() => {
    if (!loaded) setLoaded(true);
  }, []);

  // [loaded]
  useEffect(() => {
    if (loaded) setDisplayed(handleCheck());
  }, [loaded]);

  const handleClick = (event) => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setDisplayed(false);
        const notification = new Notification(
          "Canvasser Notification Confirmation",
          { body: "Notifications enabled" }
        );
      }
    });
  };

  return displayed ? (
    <IconButton
      color="inherit"
      variant="outlined"
      onClick={() => handleClick()}
    >
      <NotificationsRoundedIcon />
    </IconButton>
  ) : undefined;
}
