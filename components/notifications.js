import React from 'react';

import { Alert, Button } from '@mui/material';
import { Typography } from '@material-ui/core';

export default function Notifications(props) {
  return (
    <Alert
      variant='outlined'
      severity='warning'
      action={
        <Button
          color='inherit'
          size='small'
          onClick={() => {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') props.setNotifications(true);
            });
          }}
        >
          ENABLE
        </Button>
      }
    >
      <Typography>Notifications are not enabled.</Typography>
    </Alert>
  );
}
