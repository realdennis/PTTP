import React, { useState, useEffect } from 'react';
import Confirmation from '../components/Confirmation.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';
const ApprovingRoute = (props) => {
  /**
   * In approving state:
   * case create: confirmation and send signal<request#2>
   * case join  : confirmation and send signal<request#3>
   */

  const { mode, routeDone, setPending, routeStop, connectedUserInfo } = props;
  const [showConfirmation, setShowConfirmation] = useState(true);
  const waitRequestType = mode === 'create' ? 'request#2' : 'request#3';

  useEffect(() => {
    return () => setPending({ isPending: false });
  }, []);

  useEffect(() => {
    if (showConfirmation) return;
    sendSignalWithRetry(props, {
      type: waitRequestType,
      nickname: props.nickname,
      pubKey: props.pubKey,
    });
    // setPending({ isPending: true, text: 'Start to join the room...' });
    routeDone();
    return () => {};
  }, [showConfirmation]);
  return (
    <>
      {showConfirmation && (
        <Confirmation
          question={`Do you want to connect with ${connectedUserInfo.nickname}?`}
          onSubmit={(answer) => {
            if (!answer) {
              routeStop();
            } else {
              setShowConfirmation(false);
            }
          }}
        />
      )}
    </>
  );
};
export default ApprovingRoute;
