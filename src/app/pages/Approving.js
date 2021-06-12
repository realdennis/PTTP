import React, { useState, useEffect, useContext } from 'react';
import Confirmation from '../components/Confirmation.js';
import sendSignalWithRetry from '../../lib/sendSignalWithRetry.js';
import context from '../state/context.js';
import actionType from '../state/constants/actionType';
const ApprovingRoute = () => {
  /**
   * In approving state:
   * case create: confirmation and send signal<request#2>
   * case join  : confirmation and send signal<request#3>
   */
  const { state, dispatch, ptpObject } = useContext(context);
  const { mode } = ptpObject;
  const {
    user: { connectedUser, selfUser },
  } = state;
  const [showConfirmation, setShowConfirmation] = useState(true);
  const waitRequestType = mode === 'create' ? 'request#2' : 'request#3';

  useEffect(() => {
    return () =>
      dispatch({
        type: actionType.SET_PENDING_STATE,
        payload: { isPending: false },
      });
  }, []);

  useEffect(() => {
    if (showConfirmation) return;
    sendSignalWithRetry(ptpObject, {
      type: waitRequestType,
      nickname: selfUser.nickname,
      pubKey: selfUser.pubKey,
    });
    // setPending({ isPending: true, text: 'Start to join the room...' });
    dispatch({
      type: actionType.ROUTE_CHANGE,
      payload: {
        route: 'Connected',
      },
    });
    return () => {};
  }, [showConfirmation]);
  return (
    <>
      {showConfirmation && (
        <Confirmation
          question={`Do you want to connect with ${connectedUser.nickname}?`}
          onSubmit={(answer) => {
            if (!answer) {
              dispatch({
                type: actionType.ROUTE_CHANGE,
                payload: {
                  route: 'Exit',
                },
              });
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
