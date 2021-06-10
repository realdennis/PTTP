import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';
import Usage from '../components/Usage.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';
import waitSignal from '../../lib/waitSignal.js';

const InitialRoute = (props) => {
  const {
    peerDH,
    topic,
    setPending,
    routeDone,
    mode,
    userInfo,
    routeStop,
    setConnectedUserInfo,
    setEncrypt,
  } = props;

  const waitRequestType = mode === 'create' ? 'request#1' : 'request#2';

  useEffect(() => {
    if (mode === 'create') return;
    setPending({ isPending: true });
    return () => setPending({ isPending: false });
  }, []);

  useEffect(() => {
    let cleanupFn;
    if (mode === 'join') {
      logger('[initial route][effect] Join');
      cleanupFn = sendSignalWithRetry(props, {
        type: 'request#1',
        ...userInfo,
      });
    }
    waitSignal(props, {
      type: waitRequestType,
    })
      .then((payload) => {
        logger('[initial route][effect] wait complete');
        logger('[initial page] [after wait signal trigger] payload=', payload);
        setConnectedUserInfo(payload);
        setEncrypt({
          sessionKey: peerDH.computeSecret(payload.pubKey),
        });
        routeDone();
      })
      .catch((e) => {
        logger('[initial] error', e);
        routeStop();
      });

    return () => {
      cleanupFn && cleanupFn();
    };
  }, []);
  /**
   * In initial state:
   * case create: show usage             and wait signal<request#1>
   * case join  : send signal<request#1> and wait signal<request#2>
   */
  return mode === 'create' && <Usage topic={topic} />;
};
export default InitialRoute;
