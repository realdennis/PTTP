import React, { useState, useEffect, useContext } from 'react';
import Confirmation from '../components/Confirmation.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';
import waitSignal from '../../lib/waitSignal';
import context from '../state/context.js';
import actionType from '../state/constants/actionType';
const ApprovingRoute = () => {
  /**
   * In approving state:
   * case create: confirmation and send signal<request#2>
   * case join  : confirmation and send signal<request#3>
   */
  const { state, dispatch, pttpObject } = useContext(context);
  const { mode } = pttpObject;
  const {
    user: { connectedUser, selfUser },
  } = state;
  const [showConfirmation, setShowConfirmation] = useState(true);
  const sendRequestType = mode === 'create' ? 'request#2' : 'request#3';
  const waitRequestType = mode === 'create' ? 'request#3' : undefined;

  useEffect(() => {
    return () =>
      dispatch({
        type: actionType.SET_PENDING_STATE,
        payload: { isPending: false },
      });
  }, []);
  const handleSubmit = async (answer) => {
    setShowConfirmation(false);
    if (!answer) {
      dispatch({
        type: actionType.ROUTE_CHANGE,
        payload: {
          route: 'Exit',
        },
      });
      return;
    }
    sendSignalWithRetry(pttpObject, {
      type: sendRequestType,
      nickname: selfUser.nickname,
      pubKey: selfUser.pubKey,
    });
    if (mode === 'create') {
      dispatch({
        type: actionType.SET_PENDING_STATE,
        payload: { isPending: true, text: 'Wait for connection...' },
      });
      await waitSignal(pttpObject, {
        type: waitRequestType,
      });
      dispatch({
        type: actionType.SET_PENDING_STATE,
        payload: { isPending: false },
      });
    }
    dispatch({
      type: actionType.ROUTE_CHANGE,
      payload: {
        route: 'Connected',
      },
    });
  };

  return (
    <>
      {showConfirmation && (
        <Confirmation
          question={`Do you want to connect with ${connectedUser.nickname}?`}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
export default ApprovingRoute;
