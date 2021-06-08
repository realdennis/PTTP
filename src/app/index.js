import React, { useState, useCallback } from 'react';
import { Text, Box } from 'ink';
import Welcome from './components/Welcome.js';
import InitialRoute from './pages/Initial.js';
import ApprovingRoute from './pages/Approving.js';
import ExitRoute from './pages/Exit.js';

const App = (props) => {
  const { peerDH } = props;
  const [otherPeerPayload, setOtherPeerPayload] = useState(null);

  /**
   * peer state: "initial", "approving", "chat"
   */
  const [peerState, setPeerState] = useState('initial');
  const routeStop = useCallback(() => setPeerState('exit'));
  return (
    <Box flexDirection="column">
      <Welcome />
      {peerState === 'exit' && <ExitRoute />}
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
          <Text>
            Session key = {peerDH.computeSecret(otherPeerPayload.key)}
          </Text>
        </>
      )}
    </Box>
  );
};

export default App;
