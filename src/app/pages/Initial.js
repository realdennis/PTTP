import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';
import Usage from '../components/Usage.js';
import SpinnerWithText from '../components/SpinnerWithText.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';
import waitSignal from '../../lib/waitSignal.js';

const InitialRoute = (props) => {
  const { topic, routeDone, mode, setOtherPeerPayload } = props;

  const [pending, setPending] = useState(false);
  const waitRequestType = mode === 'create' ? 'request#1' : 'request#2';

  useEffect(() => {
    logger('[initial route][effect] 1');
    let cleanupFn;
    if (mode === 'join') {
      logger('[initial route][effect] Join');
      cleanupFn = sendSignalWithRetry(
        props,
        {
          type: 'request#1',
          nickname: props.nickname,
          key: props.pubKey,
        },
        {
          times: 5,
          interval: 1 * 1000,
        }
      );
    }
    setPending(true);
    waitSignal(props, {
      type: waitRequestType,
    })
      .then((payload) => {
        logger('[initial route][effect] wait complete');
        setOtherPeerPayload(payload);
        routeDone();
      })
      .catch((e) => {
        routeStop();
      });

    return () => {
      setPending(false);
      cleanupFn && cleanupFn();
    };
  }, []);
  /**
   * In initial state:
   * case create: show usage             and wait signal<request#1>
   * case join  : send signal<request#1> and wait signal<request#2>
   */
  return (
    <>
      {mode === 'create' && <Usage topic={topic} />}
      {pending && (
        <SpinnerWithText text={"Waiting for the other peer's response"} />
      )}
    </>
  );
};
export default InitialRoute;
