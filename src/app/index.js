import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import logger from '../utils/logger';
import Welcome from './components/Welcome.js';
import Usage from './components/Usage.js';
import SpinnerWithText from './components/SpinnerWithText.js';
import Confirmation from './components/Confirmation.js';
import sendSignalWithRetry from '../lib/sendSignalWithRetry.js';
import waitSignal from '../lib/waitSignal.js';

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

const App = (props) => {
  const [otherPeerPayload, setOtherPeerPayload] = useState(null);
  const routeStop = React.useCallback(() => {
    console.log('exit');
    process.exist();
  });
  /**
   * peer state: "initial", "approving", "chat"
   */
  const [peerState, setPeerState] = useState('initial');
  return (
    <Box flexDirection="column">
      <Welcome />
      {peerState === 'initial' && (
        <InitialRoute
          {...props}
          otherPeerPayload={otherPeerPayload}
          setOtherPeerPayload={setOtherPeerPayload}
          routeDone={() => setPeerState('approving')}
          routeStop={routeStop}
        />
      )}
      {peerState === 'approving' && (
        <ApprovingRoute
          {...props}
          otherPeerPayload={otherPeerPayload}
          routeDone={() => setPeerState('connected')}
          routeStop={routeStop}
        />
      )}
      {peerState === 'connected' && (
        /**
         * In connected state
         *
         */
        <>
          <Text>Connected</Text>
        </>
      )}
    </Box>
  );
};

export default App;
