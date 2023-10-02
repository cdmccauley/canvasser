import { useState, useEffect } from "react";

import Button from "@mui/material/Button";

export default function Notify({ params }) {
  const [loaded, setLoaded] = useState();
  const [displayed, setDisplayed] = useState(true);

  // []
  useEffect(() => {
    if (!loaded) setLoaded(true);
  }, []);

  // [Notification.permission]
  useEffect(() => {
    if (loaded)
      if (
        !("Notification" in window) ||
        Notification.permission === "granted"
      ) {
        setDisplayed(false);
      } else if (Notification.permission !== "denied") {
        setDisplayed(true);
      }
  }, [Notification.permission]);

  const handleClick = (event) => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setDisplayed(false);
        const notification = new Notification(
          "Canvasser notifications enabled"
        );
      }
    });
  };

  return displayed ? (
    <Button
      sx={{ mr: 2 }}
      color="inherit"
      variant="outlined"
      onClick={() => handleClick()}
    >
      Enable Notifications
    </Button>
  ) : undefined;
}
