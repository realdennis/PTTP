import React, { useState, useEffect } from 'react';
import Confirmation from '../components/Confirmation.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';

const ApprovingRoute = (props) => {
  /**
   * In approving state:
   * case create: confirmation and send signal<request#2>
   * case join  : confirmation and send signal<request#3>
   */

  const { mode, routeDone, routeStop, otherPeerPayload } = props;
  const [showConfirmation, setShowConfirmation] = useState(true);
  const waitRequestType = mode === 'create' ? 'request#2' : 'request#3';

  useEffect(() => {
    if (showConfirmation) return;
    const cleanupFn = sendSignalWithRetry(props, {
      type: waitRequestType,
      nickname: props.nickname,
      key: props.pubKey,
    });
    setTimeout(routeDone, 5000);
    return cleanupFn;
  }, [showConfirmation]);
  return (
    <>
      {showConfirmation && (
        <Confirmation
          question={`Do you want to connect with ${otherPeerPayload.nickname}?`}
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
