import React, { useContext, useReducer } from 'react';
import { Box } from 'ink';
import Welcome from './components/Welcome.js';
import SpinnerWithText from './components/SpinnerWithText.js';
import Pages from './pages';
import rootReducer from './state/rootReducer.js';
import logger from '../utils/logger.js';
import Context from './state/context';

const Route = () => {
  const { state } = useContext(Context);
  const Page = Pages[state.route];
  return <Page />;
};

const App = (props) => {
  const { peerDH, node, mode, topic, dynamic, relayCircuit } = props;
  /**
   * peer state: "Initial", "Approving", "Connected", "Exit"
   */
  const InitialRoute = relayCircuit ? 'RelayCircuit' : 'Initial';
  const [state, dispatch] = useReducer(rootReducer, {
    route: InitialRoute,
    pending: {
      isPending: false,
      text: "Waiting for the other peer's response",
    },
    user: {
      selfUser: {
        peerID: props.ownPeerID,
        nickname: props.nickname,
        pubKey: props.pubKey,
      },
      connectedUser: {
        peerID: '',
        nickname: '',
        pubKey: '',
      },
    },
    encrypt: {
      sessionKey: '',
      iv: '',
    },
  });
  logger('[app] [state]', state);
  return (
    <Context.Provider
      value={{
        // pttpObject is for pttp inner ipfs library usage like ipfs node instance, topic, peerID
        pttpObject: {
          node,
          mode,
          topic,
          ownPeerID: props.ownPeerID,
          dynamic /** command option for multi addr */,
          relayCircuit,
        },
        // state irrelevent
        peerDH,
        // root state and dispatch
        state,
        dispatch,
      }}
    >
      <Box flexDirection="column">
        {!(state.route === 'Connected') && <Welcome />}
        <Route />
        {state.pending.isPending && (
          <SpinnerWithText text={state.pending.text} />
        )}
      </Box>
    </Context.Provider>
  );
};

export default App;
