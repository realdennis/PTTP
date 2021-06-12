import React, { useContext, useEffect } from 'react';
import getInitializationVector from '../../lib/getInitializationVector';
import logger from '../../utils/logger';
import Usage from '../components/Usage.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';
import waitSignal from '../../lib/waitSignal.js';

import context from '../state/context';
import actionType from '../state/constants/actionType';

const InitialRoute = () => {
  const { ptpObject, peerDH, state, dispatch } = useContext(context);
  const { topic, mode } = ptpObject;
  const {
    user: { selfUser },
  } = state;
  const waitRequestType = mode === 'create' ? 'request#1' : 'request#2';

  useEffect(() => {
    if (mode === 'create') return;
    dispatch({
      type: actionType.SET_PENDING_STATE,
      payload: { isPending: true },
    });
    return () =>
      dispatch({
        type: actionType.SET_PENDING_STATE,
        payload: { isPending: false },
      });
  }, []);

  useEffect(() => {
    let cleanupFn;
    if (mode === 'join') {
      // join peer provides the initialization vector for encrypt
      const iv = getInitializationVector();
      dispatch({
        type: actionType.SET_INITIALIZATION_VECTOR,
        payload: {
          iv,
        },
      });
      logger('[initial route][effect] Join');
      cleanupFn = sendSignalWithRetry(ptpObject, {
        type: 'request#1',
        ...selfUser,
        iv,
      });
    }
    waitSignal(ptpObject, {
      type: waitRequestType,
    })
      .then((payload) => {
        logger('[initial route][effect] wait complete');
        logger('[initial page] [after wait signal trigger] payload=', payload);

        dispatch({
          type: actionType.SET_CONNECTED_USER_INFO,
          payload,
        });
        dispatch({
          type: actionType.SET_SESSION_KEY,
          payload: {
            sessionKey: peerDH.computeSecret(payload.pubKey),
          },
        });
        if (mode === 'create') {
          dispatch({
            type: actionType.SET_INITIALIZATION_VECTOR,
            payload: {
              iv: payload.iv,
            },
          });
        }
        dispatch({
          type: actionType.ROUTE_CHANGE,
          payload: {
            route: 'Approving',
          },
        });
      })
      .catch((e) => {
        logger('[initial] error', e);
        dispatch({
          type: actionType.ROUTE_CHANGE,
          payload: {
            route: 'Exit',
          },
        });
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
