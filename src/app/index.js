import React, { useState, useCallback, useReducer } from 'react';
import { Text, Box } from 'ink';
import Welcome from './components/Welcome.js';
import SpinnerWithText from './components/SpinnerWithText.js';
import InitialRoute from './pages/Initial.js';
import ApprovingRoute from './pages/Approving.js';
import ExitRoute from './pages/Exit.js';
import actionType from './constants/actionType.js';
import rootReducer from './rootReducer.js';
import logger from '../utils/logger.js';

const App = (props) => {
  const { peerDH } = props;
  /**
   * peer state: "initial", "approving", "chat"
   */
  const [state, dispatch] = useReducer(rootReducer, {
    route: 'initial',
    pending: {
      isPending: false,
      text: "Waiting for the other peer's response",
    },
    userInfo: {
      peerID: props.ownPeerID,
      nickname: props.nickname,
      pubKey: props.pubKey,
    },
    connectedUserInfo: {
      peerID: '',
      nickname: '',
      pubKey: '',
    },
    encrypt: {
      sessionKey: '',
    },
  });
  logger('[app] [state]', state);
  const routeStop = useCallback(() =>
    dispatch({ type: actionType.ROUTE_CHANGE, payload: { route: 'exit' } })
  );
  return (
    <Box flexDirection="column">
      <Welcome />
      {state.route === 'exit' && <ExitRoute />}
      {state.route === 'initial' && (
        <InitialRoute
          {...props}
          userInfo={state.userInfo}
          setConnectedUserInfo={(payload) =>
            dispatch({ type: actionType.SET_CONNECTED_USER_INFO, payload })
          }
          setPending={(payload) =>
            dispatch({ type: actionType.SET_PENDING_STATE, payload })
          }
          peerDH={peerDH}
          setEncrypt={(payload) =>
            dispatch({ type: actionType.SET_SESSION_KEY, payload })
          }
          routeDone={() =>
            dispatch({
              type: actionType.ROUTE_CHANGE,
              payload: { route: 'approving' },
            })
          }
          routeStop={routeStop}
        />
      )}
      {state.route === 'approving' && (
        <ApprovingRoute
          {...props}
          pending={state.pending}
          setPending={(payload) =>
            dispatch({ type: actionType.SET_PENDING_STATE, payload })
          }
          userInfo={state.userInfo}
          connectedUserInfo={state.connectedUserInfo}
          routeDone={() =>
            dispatch({
              type: actionType.ROUTE_CHANGE,
              payload: { route: 'connected' },
            })
          }
          routeStop={routeStop}
        />
      )}
      {state.route === 'connected' && (
        /**
         * In connected state
         *
         */
        <>
          <Text>
            Connected with{' '}
            <Text color="green">{state.connectedUserInfo.nickname}</Text>
          </Text>
          <Text>Session key = {state.encrypt.sessionKey}</Text>
        </>
      )}
      {state.pending.isPending && <SpinnerWithText text={state.pending.text} />}
    </Box>
  );
};

export default App;
