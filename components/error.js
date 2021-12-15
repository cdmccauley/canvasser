import React from 'react';

import { Alert, Button } from '@mui/material';
import { Typography } from '@material-ui/core';

export default function Error(props) {
  return (
    <Alert
      variant='outlined'
      severity='error'
      action={
        <Button
          color='inherit'
          onClick={() => {
            Object.assign(document.createElement("a"), {
                href: "https://canvasser.vercel.app/",
              }).click()
          }}
        >
          RELOAD
        </Button>
      }
    >
      <Typography>Canvasser has encountered an error.</Typography>
    </Alert>
  );
}
