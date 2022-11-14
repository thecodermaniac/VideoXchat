import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import { SocketContext } from '../Context/SocketContext';

const Notifications = () => {
  const { answerCall, CallDetails, callAccepted } = useContext(SocketContext);

  return (
    <>
      {CallDetails.isReceived && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{CallDetails.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;